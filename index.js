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
const db_users = include("database/users");
const success = db_utils.printMySQLVersion();

//reference of the express module
const app = express();

const expireTime = 24 * 60 * 60 * 1000; //expires after 1 day  (hours * minutes * seconds * millis)

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

//Main page
app.get("/", (req, res) => {
  res.render("index");
});

//Signup page
app.get("/signUp", (req, res) => {
  res.render("signUp");
});

//Login page
app.get("/login", (req, res) => {
  res.render("login");
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
