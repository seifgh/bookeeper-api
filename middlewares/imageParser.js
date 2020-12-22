const path = require("path"),
  multer = require("multer");

const allowedExts = [".jpg", ".jpeg", ".png"];

const storage = multer.diskStorage({});

const multerImageParser = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
  },

  fileFilter(req, file, callback) {
    const ext = path.extname(file.originalname);

    if (allowedExts.includes(ext)) return callback(null, true);
    return callback(new Error("Unexpected type"));
  },
}).single("image");

module.exports = (req, res, next) => {
  multerImageParser(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    }
    next();
  });
};
