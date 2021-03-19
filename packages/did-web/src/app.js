var path = require("path");
const express = require("express");
var RewriteMiddleware = require("express-htaccess-middleware");

let app = express();

var RewriteOptions = {
  file: path.resolve(__dirname, ".htaccess"),
  verbose: true,
  watch: false,
};

app.use(RewriteMiddleware(RewriteOptions));

app.get("/hello", (req, res) => {
  res.send({ message: "hello" });
});

module.exports = app;
