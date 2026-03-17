const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer= require('multer');// for handling file uploads
const upload = multer({ dest: 'uploads/' }); // specify the destination folder for uploaded files

router
.route("/")
.get(wrapAsync(listingController.index))
// .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));
.post(upload.single('listing[image][url]'),(req,res)=>{
    res.send(res.file);
})

//new route should be defined before show route because if we define show route first then it will treat "new" as an id and will try to find a listing with id "new" and will throw an error if it doesn't find any listing with id "new"
router.get("/new", isLoggedIn,listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



// // INDEX
// router.get("/",wrapAsync(listingController.index))

// SHOW
// router.get("/:id",wrapAsync( listingController.showListing));

// CREATE Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// EDIT
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// UPDATE ✅
// router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

// DELETE
// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;