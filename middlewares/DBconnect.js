const mongoose = require("mongoose");

const DBconnect = () => {
    mongoose.connect(process.env.MONGODB_URI)
            .then(()=>console.log("success connection to MongoDB"))
            .catch((error)=>console.log(`failed to connect to MongoDB: ${error}`));
}

module.exports = DBconnect;