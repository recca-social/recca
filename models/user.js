const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const Salt_Work_Factor = 10;

const userSchema = new Schema({
  username: {type: String, required:true},
  passwordHash: {type: String},
  firstName:{ type: String, required: true},
  lastName:{type: String, required: true},
  facebook:{
    id: {type: String},
    token: {type: String}
  },
  friends: [
    {type: Schema.Types.ObjectId, ref: 'User'}
  ],
  media:[
    {type: Schema.Types.ObjectId, ref: "Media"}
  ],
  posts:[
    {type: Schema.Types.ObjectId, ref: "Post"}
  ],
  totalRecommendations:{type: Number, default: 0}
  
});

userSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, Salt_Work_Factor);
});

userSchema.methods.comparePassword =function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

module.exports = User;