const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // password field not needed with passport
  // memberships: [{ type: Schema.Types.ObjectID, ref: "Membership" }],
  isAdmin: { type: Boolean, default: false },
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
