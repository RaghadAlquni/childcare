
const mongoose = require("mongoose");
const DB = process.env.MONGO_DB;



mongoose.connect(DB).then(
  () => {
    console.log("DB Ready To Use");
  },
  (err) => {
    console.log(err);
  }
);