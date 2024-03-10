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
const db_school = include("database/db_school");
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
app.get("/", async (req, res) => {
  if (!req.session.authenticated) {
    res.render("login");
  } else {
    res.render("index", {
      user_name: req.session.user_name,
      school: req.session.school,
    });
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
        res.redirect("/login");
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
        req.session.school = results[0].school_name;
        req.session.cookie.maxAge = expireTime;

        console.log(req.session.school);

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
app.get("/profile", async (req, res) => {
  var user_name = req.session.user_name;
  var results = await db_users.getUserProfile({
    user_name: user_name,
  });
  if (results && results.length > 0) {
    res.render("profile", { information: results[0] });
  } else {
    res.render("profile", { information: null }); // 사용자 정보를 찾을 수 없는 경우
  }
});

//Edit profile page
app.get("/editProfile", async (req, res) => {
  var user_name = req.session.user_name;
  var results = await db_users.getUserProfile({
    user_name: user_name,
  });

  var schools = await db_school.getSchools({});
  schools = schools[0];
  console.log(schools);
  if (results && results.length > 0) {
    res.render("editProfile", { information: results[0] });
  } else {
    res.render("404");
  }
});

//Add insurance page
app.get("/addInsurance", (req, res) => {
  res.render("addInsurance");
});

//Inbox page
app.get("/inbox", (req, res) => {
  res.render("inbox");
});

//Submit claim page
app.get("/submitClaim", async (req, res) => {
  try {
    var categories = await db_categories.getCategories({}); // 카테고리 목록을 가져옴
    categories = categories[0];
    res.render("submitClaim", { categories: categories }); // 템플릿으로 전달
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.render("submitClaim", { categories: [] }); // 오류 발생 시 빈 배열을 전달
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
