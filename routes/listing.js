const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");


const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);

  if (result.error) {
    const errMsg = result.error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }

  next();
};

// INDEX
router.get("/",wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// NEW
router.get("/new", isLoggedIn,(req, res) => {
  console.log(req.user)
  res.render("listings/new");
});

// CREATE
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  // console.log(req.user);
  newListing.owner = req.user._id; // Set the owner of the listing to the currently logged-in user
  await newListing.save();
  req.flash("success", "New Listing created successfully");
  res.redirect("/listings");
}));

// SHOW
router.get("/:id",wrapAsync( async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if(!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show", { listing });
}));

// EDIT
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
}));



// UPDATE ✅
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  if(!req.body.listing) {
    throw new ExpressError(400, "Invalid Listing Data");
  } 
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!currentUser && listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You do not have permission to edit this listing");
    res.redirect(`/listings/${id}`);
  }

  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
}));

// DELETE
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
}));


module.exports = router;