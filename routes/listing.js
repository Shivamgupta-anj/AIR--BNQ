// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
// const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
// const listingController = require("../controllers/listings.js");

// const multer= require('multer');// for handling file uploads
// const {storage} = require("../cloudConfig.js");// for handling file uploads with cloudinary

// const upload = multer({ storage }); // specify the destination folder for uploaded files save files or data in cloudinary instead of local storage

// router
// .route("/")
// .get(wrapAsync(listingController.index))
// .post(isLoggedIn, upload.single('listing[image][url]'), wrapAsync(listingController.createListing));

// //new route should be defined before show route because if we define show route first then it will treat "new" as an id and will try to find a listing with id "new" and will throw an error if it doesn't find any listing with id "new"
// router.get("/new", isLoggedIn,listingController.renderNewForm);

// // update route
// router
// .route("/:id")
// .get(wrapAsync( listingController.showListing))
// .put(isLoggedIn,isOwner, upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.updateListing))
// .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



// // // INDEX
// // router.get("/",wrapAsync(listingController.index))

// // SHOW
// // router.get("/:id",wrapAsync( listingController.showListing));

// // CREATE Route
// // router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// // EDIT
// router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


// // Booking page
// router.get("/:id/booking", isLoggedIn, async (req, res) => {
//   try {
//     const listing = await Listing.findById(req.params.id).populate("owner");
//     if (!listing) {
//       req.flash("error", "Listing not found!");
//       return res.redirect("/listings");
//     }
//     res.render("listings/booking", { listing });
//   } catch (err) {
//     req.flash("error", "Something went wrong!");
//     res.redirect("/listings");
//   }
// });
// // UPDATE ✅
// // router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

// // DELETE
// // router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// module.exports = router;


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image][url]'), wrapAsync(listingController.createListing));

// NEW — must be before /:id
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ── BOOKING — must be before /:id ─────────────────────────────────────────
router.get("/:id/booking", isLoggedIn, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/booking", { listing });
}));
// ──────────────────────────────────────────────────────────────────────────

// EDIT — also before /:id to be safe
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;