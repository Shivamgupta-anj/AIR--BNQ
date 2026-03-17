const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}

module.exports.renderNewForm = (req, res) => {
//   console.log(req.user)
  res.render("listings/new");
}


module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews", populate: { path: "author" },}).populate("owner");
  if(!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  // console.log(req.user);
  newListing.owner = req.user._id; // Set the owner of the listing to the currently logged-in user
  await newListing.save();
  req.flash("success", "New Listing created successfully");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
}

module.exports.updateListing = async (req, res) => {
  if(!req.body.listing) {
    throw new ExpressError(400, "Invalid Listing Data");
  } 
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
}