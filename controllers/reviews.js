const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Set the author of the review to the currently logged-in user
    await newReview.save();
    listing.reviews.push(newReview._id); //listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "New Review created successfully");

    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.destroyReview= async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
}