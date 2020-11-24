require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDatabase = require('./src/database/database.js')
const createRoles = require('./src/middlewares/initialSetup')

//controladores
const users = require("./src/routes/users.routes");

// inicializacion
const app = express();
createRoles()

// base de datos
connectDatabase()

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use("/api/users", users);

const port = process.env.PORT || 3500;
app.listen(port, function () {
  console.log(`Server online on http://localhost:${port}`);
});
