const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const User = new Schema(
  {
    role: {
      type: String,
      enum: ["GUEST", "ADMIN", "HOST"],
      default: "HOST",
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      require: true,
    },
    mobile: {
      type: String,
      require: true,
    },
    pincode: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
      require: true,
    },
    address: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      enum: [1, 0],
      default: 1,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
    },
    dob: String,
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otptype: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    refreshtoken: {
      type: String,
      default: "expired",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", User);
