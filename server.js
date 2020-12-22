const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  { PORT, DEBUG, MONGO_DB_URI } = require("./config"),
  { requestInfoMiddleware } = require("./middlewares/requestInfo"),
  userRouter = require("./routers/user"),
  bookmarksListRouter = require("./routers/bookmarksList"),
  bookmarkRouter = require("./routers/bookmark"),
  adminBroRouter = require("./routers/adminBro");

// initialize express app
const app = express();
// adminBro
app.use("", adminBroRouter);
// configure bodyparser to hande the post requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
// connect to mongoose
mongoose
  .connect(MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("DataBase connected");

      app.use("/user", userRouter);
      app.use("/bookmarks-list", bookmarksListRouter);
      app.use("/bookmark", bookmarkRouter);
    },
    (error) => {
      console.error(error, " DataBase connection error");
    }
  );

// middelwares
if (DEBUG) {
  app.use(requestInfoMiddleware);
}

// Launch app to the specified port
app.listen(PORT, function () {
  console.log(`Running on http://localhost:${PORT}`);
});
