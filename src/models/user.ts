import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your username"],
    min: 3,
    max: 25,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },

  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },

  isVarified: {
    type: Boolean,
    default: false,
  },
  varificationToken: String,
  varificationTokenExpire: Date,
  forgotPasswordToken: String,
  forgotPasswordTokenExpire: Date,
});

const Users = mongoose.models.users || mongoose.model("users", userSchema);

export default Users;
