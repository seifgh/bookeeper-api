const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const userShema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator(v) {
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            v
          );
        },
        type: "invalid",
      },
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(v) {
          return /^[\w\s]{2,64}$/.test(v);
        },
        type: "invalid",
      },
    },
    isAdministrator: {
      type: Boolean
    },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

userShema.plugin(uniqueValidator);

const User = mongoose.model("User", userShema);

module.exports = User;
