if(process.env.NODE_ENV !== "production"){
  require('dotenv').config(); // Load environment variables from .env file in development environment
}

const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require ("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const dns = require("dns");


// dns.setServers(["1.1.1.1", "0.0.0.0"]);
// console.log("DB URL:", process.env.ATLASDB_URL);

// const dbUrl = process.env.ATLASDB_URL
// async function main() {
//   await mongoose.connect(dbUrl);
// }

const MONGO_URL = "mongodb://localhost:27017/WonderHotel"; 
// mongoose.connect('mongodb://127.0.0.1:27017/test')
async function main() {
  await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions={
  secret:"mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expires in a week
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly : true,
  }

};
// app.get("/",(req,res)=>{
//   res.send("This is root route");
// });

app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate method is provided by passport-local-mongoose, it is used to authenticate the user

// serializeUser user related data ko session me store karta hai, 
passport.serializeUser(User.serializeUser()); //serializeUser and deserializeUser are used to store the user in the session and to retrieve the user from the session, they are provided by passport-local-mongoose
// deserializeUser session me stored data ko user object me convert karta hai, dono methods passport-local-mongoose ke dwara provide kiye gaye hain
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
   //currentUser variable ko har template me access karne ke liye, req.user is provided by passport and it contains the authenticated user
  
  

})

// app.get(
//   "/demouser", async (req,res)=>{
//     let fakeuser = new User ({
//       email : "abc@123.com",
//       username: "abc",
//     });
//     let registeredUser=await User.register(fakeuser,"shivam");
//     res.send(registeredUser);

//   }
  

// )

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); //parent route is /listings/:id, so we can access the id in the review routes as well  
app.use("/", userRouter);


main()
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.log(err));



// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews); //parent route is /listings/:id, so we can access the id in the review routes as well


// ERROR HANDLER

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
  console.log("server running on port 8080");
});

// main()
//   .then(() => {
//     console.log("connected to mongodb");
    
//     app.listen(8080, () => {
//       console.log("server running on port 8080");
//     });
//   })
//   .catch(err => console.log(err));