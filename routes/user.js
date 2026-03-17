const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
// const user = require("../models/user.js");

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router
.route("/login")
.get(userController.renderLoginForm) //renderLoginForm is used to render the login form, it is defined in controllers/users.js
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),userController.login)




// router.get("/signup",userController.renderSignupForm); //renderSignupForm is used to render the signup form, it is defined in controllers/users.js

// router.post("/signup", wrapAsync(userController.signup));

// router.get("/login",userController.renderLoginForm); //renderLoginForm is used to render the login form, it is defined in controllers/users.js

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),userController.login); //passport.authenticate is used to authenticate the user, it is provided by passport, "local" is the strategy we are using, failureRedirect is used to redirect the user back to the login page if authentication fails, and failureFlash is used to flash the error message when authentication fails.

router.get("/logout",userController.logout); //logout is used to log out the user, it is defined in controllers/users.js

module.exports = router;