const express =require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const app = express();
const categoriaRoute = require('./routes/categoria');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user',userRoute);
app.use('/categoria',categoriaRoute);

module.exports = app;