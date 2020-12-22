const { deleteOne } = require("./../models/bookmarksList");

const router = require("express").Router(),
  {
    allowAuthenticatedOnlyMiddleware,
  } = require("./../middlewares/authentication"),
  BookmarksList = require("./../models/bookmarksList"),
  Bookmark = require("./../models/bookmark");

router.use(allowAuthenticatedOnlyMiddleware);

router.get("/", (req, res) => {
  BookmarksList.find({ user: req.user._id })
    .select(["title", "bookmarks", "_id"])
    .sort({ createdAt: -1 })
    .exec((err, bookmarksLists) => {
      const formatedLists = bookmarksLists.map((list) => {
        return {
          _id: list._id,
          bookmarksLength: list.bookmarks.length,
          title: list.title,
        };
      });
      return res.json(formatedLists);
    });
});

router.post("/", (req, res) => {
  BookmarksList.create(
    { title: req.body.title, user: req.user._id },
    (err, bookmarksList) => {
      if (err) return res.status(400).json(err);
      res.status(201).json(bookmarksList);
    }
  );
});

router.put("/:_id", (req, res) => {
  BookmarksList.updateOne(
    { _id: req.params._id, user: req.user._id },
    { title: req.body.title },
    { runValidators: true },
    (err) => {
      if (err) return res.status(400).json(err);
      res.sendStatus(204);
    }
  );
});

router.delete("/:_id", (req, res) => {
  BookmarksList.deleteOne(
    { _id: req.params._id, user: req.user._id },
    (err, { deletedCount }) => {
      if (!deletedCount) return res.status(400).json({ error: "not found" });
      Bookmark.deleteMany({ bookmarksList: req.params._id });
      res.sendStatus(204);
    }
  );
});

module.exports = router;
