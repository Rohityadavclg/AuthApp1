const mongoose = require('mongoose');
require("dotenv").config();
exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
useNewUrlParser:true,
useUnifiedTopology:true
    })
    .then(()=>{console.log("DB connection succesful")})
    .catch((err)=>{
        console.log("Database issue: " + err.message);
        process.exit(1);
    })
}