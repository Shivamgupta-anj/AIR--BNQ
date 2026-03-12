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

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
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
app.get("/",(req,res)=>{
  res.send("This is root route");
});

app.use(session(sessionOptions));
app.use(flash())

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error = req.flash("error");
  next();

})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews); //parent route is /listings/:id, so we can access the id in the review routes as well  

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