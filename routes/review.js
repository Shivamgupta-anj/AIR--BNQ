const express = require("express");
const router = express.Router({mergeParams: true}); //mergeParams is used to access the params from the parent route in the child route
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// post review route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);


// delete review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;
