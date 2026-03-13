const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


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
router.get("/new", (req, res) => {
  res.render("listings/new");
});

// CREATE
router.post("/", validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();

  req.flash("success", "New Listing created successfully");
  res.redirect("/listings");
}));

// SHOW
router.get("/:id",wrapAsync( async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}));

// EDIT
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
}));



// UPDATE ✅
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
  if(!req.body.listing) {
    throw new ExpressError(400, "Invalid Listing Data");
  } 
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
}));

// DELETE
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
}));


module.exports = router;