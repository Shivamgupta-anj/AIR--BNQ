const express = require("express");
const app = express();

app.get("/",(req,res)=>{
    res.send("THIS IS RROT")
    // console.log("THIS IS ROOT")
})


app.listen(3000, () => {
  console.log("Listening on port 3000");
});