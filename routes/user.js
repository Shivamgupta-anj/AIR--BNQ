const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup");
})

// router.post ("/signup",wrapAsync(async(req,res)=>{
//     try{
//         let {username,email,password} = req.body;
//         const newUser = new User ({email,username});
//         const registeredUser = await User.register(newUser,password);
//         console.log(registeredUser);
//         req.login(registeredUser,(err)=>{
//             if(err){
//                 return next(err);
//             }   
//         req.flash("success","Welcome to WonderLust");
//         res.redirect("/listings");

//         })
//         

//     } catch(e){
//         req.flash("error",e.message);
//         res.redirect("/signup");
//     }
     
// }));

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

// failureFlash:true  is used to flash the error message when authentication fails, and failureRedirect:"/login" is used to redirect the user back to the login page if authentication fails.


router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),async(req,res)=>{

   req.flash("success","Welcome Back! You have successfully logged in.!!");
   let redirectUrl = res.locals.redirect || "/listings";
   res.redirect(redirectUrl);
})

router.get("/logout",(req,res)=>{
    req.logout((err)=> {
        if (err) { return next(err); }
        req.flash("success","You have successfully logged out.");
        res.redirect("/listings");
        // res.redirect(req.session.redirectUrl );// passport direct to the page where user was before login, if there is no page then it will direct to home page
    });
});

module.exports = router;