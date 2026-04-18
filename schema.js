// // const Joi = require("joi");

// // module.exports.listingSchema = Joi.object({
// //   listing: Joi.object({
// //     title: Joi.string().required(),
// //     description: Joi.string().required(),
// //     location: Joi.string().required(),
// //     country: Joi.string().required(),
// //     price: Joi.number().min(0).required(),

// //     image: Joi.object({
// //       url: Joi.string().allow("", null),
// //       filename: Joi.string().allow("", null)
// //     }).optional()

// //   }).required()
// // });

// // module.exports.reviewSchema = Joi.object({
// //   review: Joi.object({
// //     rating: Joi.number().min(1).max(5).required(),
// //     comment: Joi.string().required()
// //   }).required()
// // });

// const Joi = require("joi");

// module.exports.listingSchema = Joi.object({
//   listing: Joi.object({
//     title:       Joi.string().required(),
//     description: Joi.string().required(),
//     location:    Joi.string().required(),
//     country:     Joi.string().required(),
//     price:       Joi.number().min(0).required(),

//     // single image (backward compat)
//     image: Joi.object({
//       url:      Joi.string().allow("", null),
//       filename: Joi.string().allow("", null),
//     }).optional(),

//     // ✅ multiple images array
//     images: Joi.array().items(
//       Joi.object({
//         url:      Joi.string().allow("", null),
//         filename: Joi.string().allow("", null),
//       })
//     ).optional(),

//     // ✅ category field
//     category: Joi.string().allow("", null).optional(),

//   }).required(),
// });

// module.exports.reviewSchema = Joi.object({
//   review: Joi.object({
//     rating:  Joi.number().min(1).max(5).required(),
//     comment: Joi.string().required(),
//   }).required(),
// });


const Joi = require("joi");

const CATEGORIES = [
  "Beachfront",
  "Mountain",
  "City",
  "Countryside",
  "Luxury",
  "Camping",
  "Heritage",
  "Treehouse",
];

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title:       Joi.string().required(),
    description: Joi.string().required(),
    location:    Joi.string().required(),
    country:     Joi.string().required(),
    price:       Joi.number().min(0).required(),

    image: Joi.object({
      url:      Joi.string().allow("", null),
      filename: Joi.string().allow("", null),
    }).optional(),

    images: Joi.array().items(
      Joi.object({
        url:      Joi.string().allow("", null),
        filename: Joi.string().allow("", null),
      })
    ).optional(),

    // ✅ FIXED — only allow valid category values
    category: Joi.string().valid(...CATEGORIES).allow("", null).optional(),

  }).unknown(true).required(),  // unknown(true) allows any extra fields inside listing
}).unknown(true);               // unknown(true) allows any extra fields at root level

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating:  Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});
