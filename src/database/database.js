const mongoose = require("mongoose");
require("dotenv").config();

module.exports = function connectDatabase() {
  mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.set("useCreateIndex", true);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Base de datos conectada satisfactioriamente");
  });
};
