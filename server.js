const express = require("express");
const app = express();
const server = require("http").Server(app);
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
require("dotenv").config();

// Database
const db = require("./models");

// LOGGER
const morgan = require("morgan");

// Middlewares
app.use(express.json({ extended: false })); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(morgan("dev")); // logger
app.use(express.static(__dirname + "/assets")); // public folder

// cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE");
  next();
});

//REST API USER ROUTES
app.use("/api/user/auth", require("./routes/user/auth.route"));
app.use("/api/user/category", require("./routes/user/category.route"));
app.use("/api/user/product", require("./routes/user/product.route.js"));
app.use("/api/user/order", require("./routes/user/order.route.js"));
app.use("/api/user/user", require("./routes/user/user.route.js"));

// REST API ADMIN ROUTES
app.use("/api/admin/auth", require("./routes/admin/auth.route"));
app.use("/api/admin/user", require("./routes/admin/user.route"));
app.use("/api/admin/product", require("./routes/admin/product.route"));
app.use(
  "/api/admin/productimage",
  require("./routes/admin/product_image.route")
);
app.use("/api/admin/category", require("./routes/admin/category.route"));
app.use("/api/admin/order", require("./routes/admin/order.route"));


app.get("/s3/*", async (req, res) => {
  let filename = req.path.slice(1);

  try {
    let s3File = await s3
      .getObject({
        Bucket: process.env.BUCKET,
        Key: filename,
      })
      .promise();

    res.set("Content-type", s3File.ContentType);
    res.send(s3File.Body.toString()).end();
  } catch (error) {
    if (error.code === "NoSuchKey") {
      console.log(`No such key ${filename}`);
      res.sendStatus(404).end();
    } else {
      console.log(error);
      res.sendStatus(500).end();
    }
  }
});

const PORT = process.env.PORT;

db.sequelize
  .sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Started on  port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
