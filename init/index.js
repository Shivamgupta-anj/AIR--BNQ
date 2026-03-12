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



const initDB = async()=>{
   await Listing.deleteMany({});
   await Listing.insertMany(data.data);
   console.log("data was initializzed")
};
initDB();