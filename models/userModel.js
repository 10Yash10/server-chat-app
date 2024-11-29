import mongoose from "mongoose";
import bcrypt, { genSalt } from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  username: {
    type: String,
    require: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

// mongodb provide us with pre function for validation so before placing the values into database this middleware is called
userSchema.pre("save", async function (next) {
  // we are not using arrow function because we cant use "this" keyword in it. so we are using normal function defined with "function" word
  // for encrypting passwords
  const salt = await genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//creating a model
const User = mongoose.model("users", userSchema);

// exporting the user model so that controller can make use of this.
export default User;
