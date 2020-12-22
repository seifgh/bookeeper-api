const mongoose = require("mongoose");

const bookmarkShema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(v) {
          return v.length >= 1 && v.length <= 64;
        },
        type: "invalid",
        message: "title length should be in [1,64]",
      },
    },
    content: {
      type: String,
      trim: true,
    },
    bookmarksList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookmarksList",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark = mongoose.model("Bookmark", bookmarkShema);

module.exports = Bookmark;
