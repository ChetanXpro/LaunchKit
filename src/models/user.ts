import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    min: 3,
    max: 25,
    trim: true,
  },

  provider: {
    type: String,
    default: "credentials",
    enum: ["credentials", "google"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
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
  stripeCustomerId: {
    type: String,
    unique: true,
  },
  isActiveSubscription: {
    type: Boolean,
    default: false,
  },
  subscriptionId: {
    type: String,
  },
  varificationToken: String,
  varificationTokenExpire: Date,
  forgotPasswordToken: String,
  forgotPasswordTokenExpire: Date,
});

const Users = mongoose.models.users || mongoose.model("users", userSchema);

export default Users;
