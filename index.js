require("./utils");

require("dotenv").config();
const express = require("express");

// Session management
const session = require("express-session");
const MongoStore = require("connect-mongo");

//sent email to recover the password
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
const nodemailer = require("nodemailer"); // Import nodemailer
const WebsiteURL = "https://qdshacks2024.onrender.com/";
const Joi = require("joi");

// Hash passwords using BCrypt
const bcrypt = require("bcrypt");
const saltRounds = 12;

const database = include("databaseConnection");
const db_utils = include("database/db_utils");
const db_users = include("database/db_users");
const success = db_utils.printMySQLVersion();

//reference of the express module
const app = express();

const expireTime = 24 * 60 * 60 * 1000; //expires after 1 day  (hours * minutes * seconds * millis)

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const support_mail = process.env.EDUHEALTH_SUPPORT_EMAIL;
const support_password = process.env.EDUHEALTH_SUPPORT_PASSWORD;

const node_session_secret = process.env.NODE_SESSION_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
/* END secret section */

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
app.get("/", (req, res) => {
  if (!req.session.authenticated) {
    res.render("login");
  } else {
    console.log("user_name: " + req.session.user_name);
    res.render("index", { user_name: req.session.user_name });
  }
});

//Signup page
app.get("/signUp", (req, res) => {
  res.render("signUp");
});

// signingUp
app.post("/signingUp", async (req, res) => {
  var user_name = req.body.user_name;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var password = req.body.password;
  var birthdate = req.body.birthdate;
  var email = req.body.email;
  var phone = req.body.phone;
  var hashedPassword = "";

  // when password meets requirements
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err);
      res.redirect("/signup");
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
        res.render("login");
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
  res.render("login");
});

// Logging in
app.post("/loggingin", async (req, res) => {
  var user_name = req.body.user_name;
  var password = req.body.password;

  var results = await db_users.getUserByEmail({
    user_name: user_name,
  });
  if (results) {
    if (results.length == 1) {
      //there should only be 1 user in the db that matches
      if (bcrypt.compareSync(password, results[0].password)) {
        req.session.authenticated = true;
        req.session.user_name = user_name;
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
    res.redirect("/login");
  }

  res.render("login", { invalidUser: true });
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
  console.log(email);
  const user = await db_users.getUserByEmail({ email: email });

  if (!user) {
    res.render("forgotPassword", {
      msg: { text: "User not found!", type: "error" },
    });
  } else {
    const secret = JWT_SECRET + user.password;
    console.log("secret" + secret);
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
app.get("/resetPassword/:id/:token", async (req, res, next) => {
  // Get user email and token from url
  const { email, token } = req.params;

  // Find user in database
  const user = await db_users.getUserByEmail(email);

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

app.post("/resetPassword/:id/:token", async (req, res, next) => {
  const { id, token } = req.params;
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

  const user = await db_users.getUserByEmail({ _id: new ObjectId(id) });

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

// Log out
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//Profile page
app.get("/profile", (req, res) => {
  res.render("profile");
});

//Add insurance page
app.get("/addInsurance", (req, res) => {
  res.render("addInsurance");
});
//Submit claim page
app.get("/submitClaim", (req, res) => {
  res.render("submitClaim");
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
