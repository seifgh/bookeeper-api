const router = require("express").Router(),
  {
    allowAuthenticatedOnlyMiddleware,
  } = require("./../middlewares/authentication"),
  Bookmark = require("./../models/bookmark"),
  BookmarksList = require("./../models/bookmarksList");

router.use(allowAuthenticatedOnlyMiddleware);

router.get("/:_bookmarksListId", (req, res) => {
  BookmarksList.findOne(
    { _id: req.params._bookmarksListId, user: req.user._id },
    (err, bookmarksList) => {
      if (!bookmarksList) return res.status(400).json({ error: "not found" });
      Bookmark.find({
        bookmarksList: req.params._bookmarksListId,
      })
        .select(["title", "content", "_id"])
        .sort({ createdAt: -1 })
        .exec((err, bookmarks) => {
          return res.json(bookmarks);
        });
    }
  );
});

router.post("/:_bookmarksListId", (req, res) => {
  BookmarksList.findOne(
    { _id: req.params._bookmarksListId, user: req.user._id },
    (err, bookmarksList) => {
      if (!bookmarksList) return res.status(400).json({ error: "not found" });
      Bookmark.create(
        {
          title: req.body.title,
          content: req.body.content,
          bookmarksList: req.params._bookmarksListId,
        },
        (err, bookmark) => {
          if (err) return res.status(400).json(err);
          bookmarksList.bookmarks.push(bookmark);
          bookmarksList.save();
          res.status(201).send(bookmark);
        }
      );
    }
  );
});

router.put("/:_id", (req, res) => {
  Bookmark.findById(req.params._id)
    .populate("bookmarksList")
    .exec((err, bookmark) => {
      if (
        !bookmark ||
        // bookmarksList is not owned by the user
        bookmark.bookmarksList.user.toString() != req.user._id.toString()
      )
        return res.status(400).json({ error: "not found" });
      Bookmark.updateOne(
        { _id: req.params._id },
        { title: req.body.title, content: req.body.content },
        { runValidators: true },
        (err) => {
          if (err) return res.status(400).json(err);
          res.sendStatus(204);
        }
      );
    });
});

router.delete("/:_id", (req, res) => {
  Bookmark.findById(req.params._id)
    .populate("bookmarksList")
    .exec((err, bookmark) => {
      if (
        !bookmark ||
        // check if the bookmarksList is not owned by the user
        bookmark.bookmarksList.user.toString() != req.user._id.toString()
      )
        return res.status(400).json({ error: "not found" });

      Bookmark.deleteOne({ _id: req.params._id }, (_, { deletedCount }) => {
        if (!deletedCount) return res.status(400).json({ error: "not found" });
        bookmark.bookmarksList.bookmarks.pull(bookmark);
        bookmark.bookmarksList.save();
        res.sendStatus(204);
      });
    });
});

module.exports = router;
