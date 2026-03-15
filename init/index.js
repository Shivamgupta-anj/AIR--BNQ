const mongoose = require("mongoose");
const data=require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("error connecting to mongodb", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to mongodb");
};



// const initDB = async()=>{
//    await Listing.deleteMany({});
//    initData.data=initData.data.map((obj)=>({...obj,owner : "69b5144411269eeaeb5b8385"})); //creating a dummy user as owner of all the listings
//    await Listing.insertMany(data.data);
//    console.log("data was initializzed")
// };

const initDB = async () => {
   await Listing.deleteMany({});

   data.data = data.data.map((obj) => ({
      ...obj,
      owner: "69b5144411269eeaeb5b8385"
   }));

   await Listing.insertMany(data.data);

   console.log("data was initialized");
};
initDB();