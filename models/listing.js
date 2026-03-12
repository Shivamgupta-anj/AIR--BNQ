const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// ✅ Correct name
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  location: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1717538836473-7925f9ea6744?q=80&w=1160&auto=format&fit=crop",
    },
  },
  country: String,

  // ✅ Use plural (recommended)
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});


// ✅ CASCADE DELETE MIDDLEWARE
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});


// ✅ Create model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;