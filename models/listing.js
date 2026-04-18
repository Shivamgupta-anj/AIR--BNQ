// // // const mongoose = require("mongoose");
// // // const Review = require("./review");
// // // const Schema = mongoose.Schema;

// // // // ✅ Correct name
// // // const listingSchema = new Schema({
// // //   title: {
// // //     type: String,
// // //     required: true,
// // //   },
// // //   description: String,
// // //   price: Number,
// // //   location: String,
// // //   image: {
// // //     // filename: String,
// // //     // url: {
// // //     //   type: String,
// // //     //   default:
// // //     //     "https://images.unsplash.com/photo-1717538836473-7925f9ea6744?q=80&w=1160&auto=format&fit=crop",
// // //     // },
// // //     url : String,
// // //     filename: String,
// // //   },
// // //   country: String,

// // //   // ✅ Use plural (recommended)
// // //   reviews: [
// // //     {
// // //       type: Schema.Types.ObjectId,
// // //       ref: "Review",
// // //     },
// // //   ],
// // //   owner: {
// // //   type: Schema.Types.ObjectId,
// // //   ref: "User",
// // // }
// // // });


// // // // ✅ CASCADE DELETE MIDDLEWARE
// // // listingSchema.post("findOneAndDelete", async (listing) => {
// // //   if (listing) {
// // //     await Review.deleteMany({
// // //       _id: { $in: listing.reviews },
// // //     });
// // //   }
// // // });


// // // // ✅ Create model
// // // const Listing = mongoose.model("Listing", listingSchema);

// // // module.exports = Listing;

// // const mongoose = require("mongoose");
// // const Review = require("./review");
// // const Schema = mongoose.Schema;

// // const listingSchema = new Schema({
// //   title: {
// //     type: String,
// //     required: true,
// //   },
// //   description: String,
// //   price: Number,
// //   location: String,
// //   image: {
// //     url: String,
// //     filename: String,
// //   },

// //   images: [         // ← ADD THIS — array for multiple images
// //     {
// //       url: String,
// //       filename: String,
// //     }
// //   ],
// //   country: String,

// //   // ✅ ADD THIS
// //   category: {
// //     type: String,
// //     enum: ["Trending", "Rooms", "Cities", "Pools", "Beach", "LakeFront", "Castles", "Farms", "Arctic", "Domes", "Boats"],
// //     default: "Trending",
// //   },

// //   reviews: [
// //     {
// //       type: Schema.Types.ObjectId,
// //       ref: "Review",
// //     },
// //   ],
// //   owner: {
// //     type: Schema.Types.ObjectId,
// //     ref: "User",
// //   },
// // });

// // // ✅ CASCADE DELETE MIDDLEWARE
// // listingSchema.post("findOneAndDelete", async (listing) => {
// //   if (listing) {
// //     await Review.deleteMany({
// //       _id: { $in: listing.reviews },
// //     });
// //   }
// // });

// // const Listing = mongoose.model("Listing", listingSchema);

// // module.exports = Listing;


// const mongoose = require("mongoose");
// const Review = require("./review");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   price: Number,
//   location: String,
//   image: {
//     url: String,
//     filename: String,
//   },
//   images: [
//     {
//       url: String,
//       filename: String,
//     }
//   ],
//   country: String,

//   // ✅ FIXED — matches exactly what edit.ejs category pills send
//   category: {
//     type: String,
//     enum: [
//       "Beachfront",
//       "Mountain",
//       "City",
//       "Countryside",
//       "Luxury",
//       "Camping",
//       "Heritage",
//       "Treehouse",
//     ],
//     default: "Beachfront",
//   },

//   reviews: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Review",
//     },
//   ],
//   owner: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//   },
// });

// // CASCADE DELETE — remove reviews when listing is deleted
// listingSchema.post("findOneAndDelete", async (listing) => {
//   if (listing) {
//     await Review.deleteMany({ _id: { $in: listing.reviews } });
//   }
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;


const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  location: String,
  image: {
    url: String,
    filename: String,
  },
  images: [
    {
      url: String,
      filename: String,
    }
  ],
  country: String,

  // ✅ FIXED — matches exactly what edit.ejs category pills send
  category: {
    type: String,
    enum: [
      "Beachfront",
      "Mountain",
      "City",
      "Countryside",
      "Luxury",
      "Camping",
      "Heritage",
      "Treehouse",
    ],
    default: "Beachfront",
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// CASCADE DELETE — remove reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
