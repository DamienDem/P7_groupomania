const express = require("express");
const morgan = require("morgan");
const path = require("path");
const {checkUser, requireAuth} = require('./middleware/auth');
const userRoutes = require("./routes/User");
const postRoutes = require("./routes/Post");
const likeRoutes = require("./routes/Like");
const commentRoutes = require("./routes/Comment");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));

app
  .use(express.json())
  .use(express.urlencoded({extended:false}))
  .use(cookieParser())
  .use(morgan("dev"))
  .use("/images", express.static(path.join(__dirname, "images")));

  app.get('*', checkUser);
  app.get('/token', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user.id+"")
  });

app
  .use("/", userRoutes)
  .use("/", postRoutes)
  .use("/", likeRoutes)
  .use("/", commentRoutes);

module.exports = app;
