const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String, 
      required:true
    },
    email: {
      type: String, 
      required:true, 
      unique:true
    },
    password: {
      type: String,  
      required:true
    },
    roles: {
      type: [String],
      default: ["user"]
    },
    active: {
      type: Boolean, 
      default: true
    },
    refreshToken : [String]
  }
);


module.exports = mongoose.model('User', userSchema);