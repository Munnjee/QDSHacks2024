require("./utils");

require("dotenv").config();
const express = require("express");

// Session management
const session = require("express-session");
const MongoStore = require("connect-mongo");
// Hash passwords using BCrypt
const bcrypt = require("bcrypt");
const saltRounds = 12;

const database = include("databaseConnection");
const db_utils = include("database/db_utils");
const db_users = include("database/db_users");
const db_schools = include("database/db_schools");
const db_claims = include("database/db_claims");
const db_categories = include("database/db_categories");
const success = db_utils.printMySQLVersion();

//reference of the express module
const app = express();

const expireTime = 24 * 60 * 60 * 10; //expires after 1 day  (hours * minutes * seconds * millis)

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;

const support_mail = process.env.EDUHEALTH_SUPPORT_EMAIL;
const support_password = process.env.EDUHEALTH_SUPPORT_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
//reset password
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Joi = require("joi");
const WebsiteURL = "https://qdshacks2024.onrender.com";
/* END secret section */

/* Scheduling system */
const cron = require("node-cron");

// Every month at midnight on the 1st day
cron.schedule("0 0 1 * *", () => {
  console.log("running a task at midnight on the 1st day of every month");
});

app.set("view engine", "ejs");

// parse application/json
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
  crypto: {
    secret: mongodb_session_secret,
  },
});

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore, //default is memory store
    saveUninitialized: false,
    resave: true,
  })
);

function isValidSession(req) {
  if (req.session.authenticated) {
    return true;
  }
  return false;
}

function sessionValidation(req, res, next) {
  if (!isValidSession(req)) {
    req.session.destroy();
    res.redirect("/login");
    return;
  } else {
    next();
  }
}

//Main page
app.get("/", async (req, res) => {
  if (!req.session.authenticated) {
    res.render("login");
  } else {
    var user_name = req.session.user_name;
    var school_name = req.session.school_name;
    var coverage_results = await db_users.getUserCoverageInformation({
      user_name: user_name,
      school_name: school_name,
    });

    var claim_results = await db_claims.getClaims({
      user_name: user_name,
      school_name: school_name,
    });

    console.log(coverage_results[0]);
    console.log(claim_results);

    const updatedResults = calculateAndUpdateLimits(
      coverage_results,
      claim_results
    );

    console.log("Updated coverage results:");
    updatedResults.forEach((result, index) => {
      console.log(`[${index}]:`);
      console.log(result);
    });

    res.render("index", {
      user_name: user_name,
      school_name: req.session.school_name,
      information: updatedResults,
    });
  }
});

function calculateAndUpdateLimits(coverage_results, claim_results) {
  for (let coverage of coverage_results) {
    let totalClaimAmount = 0;
    for (let claim of claim_results) {
      if (claim.category_id === coverage.category_id) {
        totalClaimAmount += parseFloat(claim.total_amount);
      }
    }
    // console.log(
    //   "Total claim amount for category " +
    //     coverage.category_name +
    //     ": " +
    //     totalClaimAmount
    // );

    // original limit is used to calculate the percentage
    coverage.originalLimit = coverage.limit;

    if (coverage.limit !== undefined) {
      coverage.limit -= totalClaimAmount * (coverage.percentage / 100);
      console.log(
        "Updated limit for category " +
          coverage.category_name +
          ": " +
          coverage.limit
      );
    } else {
      // console.log(
      //   "Warning: No limit found for category " + coverage.category_name
      // );
    }
    coverage.amountPaid = coverage.originalLimit - coverage.limit;
  }

  return coverage_results;
}

//Signup page
app.get("/signUp", async (req, res) => {
  try {
    var schools = await db_schools.getSchools({}); // 학교 목록을 가져옴
    schools = schools[0];
    res.render("signUp", {
      schools: schools,
    }); // 템플릿으로 전달
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.render("404", {}); // 오류 발생 시 빈 배열을 전달
  }
});

// signingUp
app.post("/signingUp", async (req, res) => {
  var user_name = req.body.user_name;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var password = req.body.password;
  var birthdate = req.body.birthdate;
  var school_id = req.body.school;
  var email = req.body.email;
  var phone = req.body.phone;
  var hashedPassword = "";

  // when password meets requirements
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      hashedPassword = hash;
      var success = await db_users.signUpUser({
        user_name: user_name,
        first_name: first_name,
        last_name: last_name,
        password: hashedPassword,
        birthdate: birthdate,
        email: email,
        phone: phone,
      });

      if (success) {
        var user_id = await db_users.getUserId({
          user_name: user_name,
        });

        user_id = user_id[0].user_id;
        var success_school = await db_schools.signUpSchool({
          frn_user_id: user_id,
          frn_school_id: school_id,
        });

        if (success_school) {
          res.redirect("/login");
        }
      } else {
        res.render("errorMessage", { error: "Failed to create user." });
      }
    }
  });
});

//Login page
app.get("/login", (req, res) => {
  if (isValidSession(req)) {
    res.redirect("/");
    return;
  } else {
    var errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
    res.render("login", { errorMessage: errorMessage });
  }
});

// Logging in
app.post("/loggingin", async (req, res) => {
  var user_name = req.body.user_name;
  var password = req.body.password;

  var results = await db_users.getUserSchool({
    user_name: user_name,
  });
  if (results) {
    if (results.length == 1) {
      //there should only be 1 user in the db that matches
      if (bcrypt.compareSync(password, results[0].password)) {
        req.session.authenticated = true;
        req.session.user_name = user_name;
        req.session.school_name = results[0].school_name;
        req.session.cookie.maxAge = expireTime;

        res.redirect("/");
        return;
      } else {
        console.log("invalid password");
      }
    } else {
      console.log("invalid user");
    }
  } else {
    console.log(
      "invalid number of users matched: " + results.length + " (expected 1)."
    );
    res.redirect("login");
  }

  res.render("login", { invalidUser: true });
});

// Log out
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//Profile page
app.use("/profile", sessionValidation);
app.get("/profile", async (req, res) => {
  var user_name = req.session.user_name;
  var results = await db_users.getUserProfile({
    user_name: user_name,
  });
  if (results && results.length > 0) {
    res.render("profile", {
      information: results[0],
      school_name: req.session.school_name,
    });
  } else {
    res.render("profile", { information: null }); // 사용자 정보를 찾을 수 없는 경우
  }
});

//Edit profile page
app.use("/editProfile", sessionValidation);
app.get("/editProfile", async (req, res) => {
  var user_name = req.session.user_name;
  var results = await db_users.getUserProfile({
    user_name: user_name,
  });

  var schools = await db_schools.getSchools({});
  schools = schools[0];
  console.log(schools);
  if (results && results.length > 0) {
    res.render("editProfile", {
      information: results[0],
      school_name: req.session.school_name,
    });
  } else {
    res.render("404");
  }
});

/* Id and Password Recovery Section */
// Renders the forgot id page
app.get("/forgotPassword", (req, res, next) => {
  var msg = req.query.msg || "";
  var msgType = req.query.msgType || "";

  res.render("forgotPassword", { msg: { text: msg, type: msgType } });
});

// Sends the reset password email
app.post("/forgotPassword", async (req, res, next) => {
  const { email } = req.body;
  const user = await db_users.getUserByEmail({ email: email });

  if (!user) {
    res.render("forgotPassword", {
      msg: { text: "User not found!", type: "error" },
    });
  } else {
    const secret = JWT_SECRET + user.password;
    const payload = {
      email: email,
      user_name: user.user_name,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });

    const link = `${WebsiteURL}/resetPassword/${user.user_name}/${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: support_mail,
        pass: support_password,
      },
    });

    // send mail with defined transport object
    const mailOptions = {
      from: `"EduHealth" <${support_mail}>`, // Sender address
      to: email, // Recipient address
      subject: "EduHealth Password Recovery", // Subject line
      html: `<p>Please click this <a href="${link}">link</a> to reset your password.</p>`, // HTML body
    };
    console.log(email);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.render("forgotPassword", {
          msg: {
            text: "An error occurred while sending the email.",
            type: "error",
          },
        });
      }

      console.log("Email sent: " + info.response);
      res.render("forgotPassword", {
        msg: { text: "Password reset link has been sent!", type: "success" },
      });
    });
  }
});

// Renders the reset password page
app.get("/resetPassword/:user_name/:token", async (req, res, next) => {
  // Get user email and token from url
  const { user_name, token } = req.params;

  // Find user in database
  const user = await db_users.getUserByEmail(user_name);

  // If user does not exist, return error message
  if (!user) {
    return res.render("error", { errorMessage: "ID not found!" });
  }

  // Create secret for JWT
  const secret = JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.render("resetPassword", { email: user.email });
  } catch (error) {
    console.log(error);
    return res.render("error", { errorMessage: "Invalid token!" });
  }
});

app.post("/resetPassword/:user_name/:token", async (req, res, next) => {
  const { user_name, token } = req.params;
  const { newPassword } = req.body;

  const schema = Joi.object({
    newPassword: Joi.string().required().messages({
      "string.empty": "New password is required",
      "any.required": "New password is required",
    }),
  });

  const validationResult = schema.validate({ newPassword });

  if (validationResult.error) {
    const errorMessage = validationResult.error.details[0].message;
    return res.render("error", { errorMessage: "Validation error!" });
  }

  const user = await db_users.getUserByEmail({ user_name: user_name });

  if (!user) {
    return res.render("error", { errorMessage: "ID not found!" });
  }

  const secret = JWT_SECRET + user.password;

  try {
    const payload = jwt.verify(token, secret);
    user.password = await bcrypt.hash(newPassword, saltRounds);

    await db_users.updatePassword(
      { user_name: new ObjectId(user_name) },
      { $set: { password: user.password } }
    );

    return res.render("passwordUpdated");
  } catch (error) {
    console.log(error);
    return res.render("error", { errorMessage: "Invalid token!" });
  }
});

/* Password Recovery Section end */

//Add insurance page
app.use("/addInsurance", sessionValidation);
app.get("/addInsurance", (req, res) => {
  res.render("addInsurance");
});

//Inbox page
app.use("/inbox", sessionValidation);
app.get("/inbox", (req, res) => {
  res.render("inbox", { school_name: req.session.school_name });
});

//Submit claim page
app.use("/submitClaim", sessionValidation);
app.get("/submitClaim", async (req, res) => {
  try {
    var schools = await db_schools.getMySchools({
      user_name: req.session.user_name,
    }); // 학교 목록을 가져옴
    var categories = await db_categories.getCategories({}); // 카테고리 목록을 가져옴
    schools = schools[0];
    categories = categories[0];
    res.render("submitClaim", {
      schools: schools,
      categories: categories,
      school_name: req.session.school_name,
    }); // 템플릿으로 전달
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.render("submitClaim", {
      schools: [],
      categories: [],
      school_name: req.session.school_name,
    }); // 오류 발생 시 빈 배열을 전달
  }
});

app.post("/submittingClaim", async (req, res) => {
  var user_name = req.session.user_name;
  var school_id = req.body.school;
  var category_id = req.body.category;
  var amount = parseInt(req.body.amount);
  console.log("user_name: " + user_name);
  console.log("school_id: " + school_id);
  console.log("category_id: " + category_id);

  var results = await db_users.getUserClaim({
    user_name: user_name,
    school_id: school_id,
    category_id: category_id,
  });
  if (results.length > 0) {
    var success = await db_claims.submitClaim({
      user_school_id: results[0].user_school_id,
      coverage_id: results[0].coverage_id,
      amount: amount,
    });
    if (success) {
      res.redirect("/");
      return;
    } else {
      res.render("errorMessage", { error: "Failed to submit claim." });
    }
  } else {
    console.log(
      "invalid number of users matched: " + results.length + " (expected 1)."
    );
    res.redirect("404");
  }
});

// Serve static files
app.use(express.static(__dirname + "/public"));

//  Catch all other routes and 404s
app.get("*", (req, res) => {
  res.status(404);
  // res.send("Page not found - 404");
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
