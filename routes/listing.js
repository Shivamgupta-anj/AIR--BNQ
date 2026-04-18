// // // const express = require("express");
// // // const router = express.Router();
// // // const wrapAsync = require("../utils/wrapAsync.js");
// // // const Listing = require("../models/listing.js");
// // // const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
// // // const listingController = require("../controllers/listings.js");

// // // const multer= require('multer');// for handling file uploads
// // // const {storage} = require("../cloudConfig.js");// for handling file uploads with cloudinary

// // // const upload = multer({ storage }); // specify the destination folder for uploaded files save files or data in cloudinary instead of local storage

// // // router
// // // .route("/")
// // // .get(wrapAsync(listingController.index))
// // // .post(isLoggedIn, upload.single('listing[image][url]'), wrapAsync(listingController.createListing));

// // // //new route should be defined before show route because if we define show route first then it will treat "new" as an id and will try to find a listing with id "new" and will throw an error if it doesn't find any listing with id "new"
// // // router.get("/new", isLoggedIn,listingController.renderNewForm);

// // // // update route
// // // router
// // // .route("/:id")
// // // .get(wrapAsync( listingController.showListing))
// // // .put(isLoggedIn,isOwner, upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.updateListing))
// // // .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



// // // // // INDEX
// // // // router.get("/",wrapAsync(listingController.index))

// // // // SHOW
// // // // router.get("/:id",wrapAsync( listingController.showListing));

// // // // CREATE Route
// // // // router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// // // // EDIT
// // // router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


// // // // Booking page
// // // router.get("/:id/booking", isLoggedIn, async (req, res) => {
// // //   try {
// // //     const listing = await Listing.findById(req.params.id).populate("owner");
// // //     if (!listing) {
// // //       req.flash("error", "Listing not found!");
// // //       return res.redirect("/listings");
// // //     }
// // //     res.render("listings/booking", { listing });
// // //   } catch (err) {
// // //     req.flash("error", "Something went wrong!");
// // //     res.redirect("/listings");
// // //   }
// // // });
// // // // UPDATE ✅
// // // // router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

// // // // DELETE
// // // // router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// // // module.exports = router;


// // const express = require("express");
// // const router = express.Router();
// // const wrapAsync = require("../utils/wrapAsync.js");
// // const Listing = require("../models/listing.js");
// // const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// // const listingController = require("../controllers/listings.js");

// // const multer = require('multer');
// // const { storage } = require("../cloudConfig.js");

// // const upload = multer({ storage });

// // // INDEX + CREATE
// // router
// //   .route("/")
// //   .get(wrapAsync(listingController.index))
// //   .post(isLoggedIn, upload.single('listing[image][url]'), wrapAsync(listingController.createListing));

// // // NEW — must be before /:id
// // router.get("/new", isLoggedIn, listingController.renderNewForm);

// // // ── BOOKING — must be before /:id ─────────────────────────────────────────
// // router.get("/:id/booking", isLoggedIn, wrapAsync(async (req, res) => {
// //   const listing = await Listing.findById(req.params.id).populate("owner");
// //   if (!listing) {
// //     req.flash("error", "Listing not found!");
// //     return res.redirect("/listings");
// //   }
// //   res.render("listings/booking", { listing });
// // }));
// // // ──────────────────────────────────────────────────────────────────────────

// // // EDIT — also before /:id to be safe
// // router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// // // SHOW + UPDATE + DELETE
// // router
// //   .route("/:id")
// //   .get(wrapAsync(listingController.showListing))
// //   .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.updateListing))
// //   .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// // module.exports = router;


// const Listing = require("../models/listing");

// // ── INDEX ──────────────────────────────────────────────────────────────────
// module.exports.index = async (req, res) => {
//   const { category } = req.query;

//   let filter = {};
//   if (category) {
//     filter.category = category;
//   }

//   const allListings = await Listing.find(filter);
//   res.render("listings/index", {
//     allListings,
//     selectedCategory: category || null,
//   });
// };

// // ── NEW FORM ───────────────────────────────────────────────────────────────
// module.exports.renderNewForm = (req, res) => {
//   res.render("listings/new");
// };

// // ── SHOW ───────────────────────────────────────────────────────────────────
// module.exports.showListing = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id)
//     .populate({ path: "reviews", populate: { path: "author" } })
//     .populate("owner");
//   if (!listing) {
//     req.flash("error", "Listing not found");
//     return res.redirect("/listings");
//   }
//   res.render("listings/show", { listing });
// };

// // ── BOOKING PAGE ───────────────────────────────────────────────────────────
// module.exports.showBooking = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id).populate("owner");
//   if (!listing) {
//     req.flash("error", "Listing not found");
//     return res.redirect("/listings");
//   }
//   res.render("listings/booking", { listing });
// };

// // ── CREATE ─────────────────────────────────────────────────────────────────
// module.exports.createListing = async (req, res) => {
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;

//   if (req.files && req.files.length > 0) {
//     // Multiple images uploaded via upload.array()
//     const uploadedImages = req.files.map(f => ({
//       url: f.path,
//       filename: f.filename,
//     }));

//     newListing.images = uploadedImages;           // save all to images array
//     newListing.image  = uploadedImages[0];        // first one as main image (backward compat)

//   } else if (req.file) {
//     // Fallback: single file upload
//     newListing.image  = { url: req.file.path, filename: req.file.filename };
//     newListing.images = [newListing.image];
//   }

//   await newListing.save();
//   req.flash("success", "New Listing created successfully");
//   res.redirect("/listings");
// };

// // ── EDIT FORM ──────────────────────────────────────────────────────────────
// module.exports.renderEditForm = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing) {
//     req.flash("error", "Listing not found");
//     return res.redirect("/listings");
//   }

//   // Build a smaller preview URL for the current main image
//   let originalImageUrl = "";
//   if (listing.image && listing.image.url) {
//     originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
//   }

//   res.render("listings/edit", { listing, originalImageUrl });
// };

// // ── UPDATE ─────────────────────────────────────────────────────────────────
// module.exports.updateListing = async (req, res) => {
//   const { id } = req.params;

//   // Update scalar fields (title, description, price, location, country, category)
//   let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

//   if (req.files && req.files.length > 0) {
//     // New images were uploaded — replace the gallery
//     const uploadedImages = req.files.map(f => ({
//       url: f.path,
//       filename: f.filename,
//     }));

//     listing.images = uploadedImages;         // replace entire images array
//     listing.image  = uploadedImages[0];      // update main image too
//     await listing.save();

//   } else if (req.file) {
//     // Fallback: single file uploaded
//     listing.image  = { url: req.file.path, filename: req.file.filename };
//     listing.images = [listing.image];
//     await listing.save();
//   }
//   // If no new files uploaded → keep existing images untouched

//   req.flash("success", "Listing updated successfully");
//   res.redirect(`/listings/${id}`);
// };

// // ── DELETE ─────────────────────────────────────────────────────────────────
// module.exports.destroyListing = async (req, res) => {
//   const { id } = req.params;
//   await Listing.findByIdAndDelete(id);
//   req.flash("success", "Listing deleted successfully");
//   res.redirect("/listings");
// };
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// ── INDEX + CREATE ─────────────────────────────────────────────────────────
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.array("listing[images]", 5),   // ✅ was: upload.single('listing[image][url]')
    wrapAsync(listingController.createListing)
  );

// ── NEW FORM — must be before /:id ────────────────────────────────────────
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ── BOOKING PAGE — must be before /:id ───────────────────────────────────
router.get("/:id/booking", isLoggedIn, wrapAsync(listingController.showBooking));

// ── EDIT FORM — must be before /:id ──────────────────────────────────────
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// ── SHOW + UPDATE + DELETE ────────────────────────────────────────────────
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.array("listing[images]", 5),   // ✅ was: upload.single('listing[image][url]')
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
