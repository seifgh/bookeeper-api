const router = require("express").Router(),
  Bcrypt = require("bcryptjs"),
  JsonWebToken = require("jsonwebtoken"),
  User = require("../models/user"),
  {
    allowAuthenticatedOnlyMiddleware,
  } = require("./../middlewares/authentication"),
  imageParser = require("./../middlewares/imageParser"),
  FirebaseUploder = require("./../clouds/firebase-storage"),
  { validatePassword } = require("../utils"),
  { SECRET_JWT_CODE } = require("./../config");

router.get("/", allowAuthenticatedOnlyMiddleware, async (req, res) => {
  res.json(req.user);
});

router.post("/signup", imageParser, (req, res) => {
  // validate password before crypt
  if (!validatePassword(req.body.password))
    return res.status(400).json({ errors: { password: "invalid" } });
  // crypt the password
  req.body.password = Bcrypt.hashSync(req.body.password);

  let firebaseUploader;
  // profile image provided
  if (req.file) {
    // set imageUrl column
    firebaseUploader = new FirebaseUploder(req.file);
    req.body.imageUrl = firebaseUploader.fileUrl;
  }

  User.create(req.body, (err, user) => {
    // invalid data
    if (err) return res.status(400).json(err);
    const authToken = JsonWebToken.sign(
      {
        id: user._id,
      },
      SECRET_JWT_CODE,
      { expiresIn: "60d" }
    );

    // upload the image
    if (req.file) {
      firebaseUploader.upload();
    }

    // create and send auth token
    res.status(201).json({
      user,
      authToken,
    });
  });
});

router.post("/signin", (req, res) => {
  const { password, email } = req.body;
  // check data
  if (!(password && email)) return res.status(400).json({ error: "no params" });
  User.findOne({ email }, (err, user) => {
    if (!user) return res.status(400).json({ error: "not found" });
    // verify password
    if (!Bcrypt.compareSync(password, user.password))
      return res.status(400).json({ error: "wrong password" });
    // create and send auth token
    res.json({
      user,
      authToken: JsonWebToken.sign(
        {
          id: user._id,
        },
        SECRET_JWT_CODE,
        { expiresIn: "60d" }
      ),
    });
  });
});

module.exports = router;
