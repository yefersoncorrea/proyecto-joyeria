const express = require("express");
var cors = require("cors");
const connection = require("./connection");
const userRoute = require("./routes/user");
const categoriaRoute = require("./routes/categoria");
const productoRoute = require("./routes/producto");
const facturaRoute = require("./routes/factura");
const dashboardRoute = require("./routes/dashboard");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoute);
app.use("/categoria", categoriaRoute);
app.use("/producto", productoRoute);
app.use("/factura", facturaRoute);
app.use("/dashboard", dashboardRoute);

module.exports = app;
