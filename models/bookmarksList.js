const mongoose = require("mongoose");

const bookmarksListShema = new mongoose.Schema(
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
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bookmark" }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BookmarksList = mongoose.model("BookmarksList", bookmarksListShema);

module.exports = BookmarksList;
