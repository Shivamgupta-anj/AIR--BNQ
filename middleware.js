const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()) {

      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be logged in to create listing");
      return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    } else {
        res.locals.redirectUrl = "/listings";
    } 
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
      let listing = await Listing.findById(id);
      if( !listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
      }
      next();
    
}


module.exports.validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);

  if (result.error) {
    const errMsg = result.error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};


module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id, reviewId } = req.params;
      let review = await Review.findById(reviewId);
      if( !review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this Review");
        return res.redirect(`/listings/${id}`);
      }
      next();
    
}