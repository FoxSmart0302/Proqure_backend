const express = require("express");
const app = express();
const http = require('http');
const cors = require("cors");
const { query } = require("./models/mysqlConnect");
const passport = require('./utils/passport');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
var multer = require('multer');
require("dotenv").config();
// var upload = multer();
app.use(cors());

//create socket http server
const socket = require('./utils/socket');

const PORT = process.env.PORT || 5005

const payment = require("./routes/payment");
const item = require('./routes/item');
const category = require('./routes/category');
const user = require("./routes/user");
const client = require("./routes/client");

// admin 
const product = require('./routes/product');
const coupon = require('./routes/coupon');
const notification = require('./routes/notification');
const segment = require('./routes/segment');

// middlewares

// app.use(upload.any());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));



app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// db connection check
query('SELECT * from tbl_users')
    .then(result => {
        console.log("Db connection successful");
    })
    .catch(err => {
        console.log("Db connection failed", err);
        throw(err);
        return;
    })

app.use('/api/payment', payment);
app.use('/api/user', user);
app.use('/api/category', category);
app.use('/api/item', item);
app.use('/api/segment', segment);
//admin
app.use('/api/client', client);
app.use('/api/product', product)
app.use('/api/coupon', coupon)
app.use('/api/notification', notification)
// const server = require('http').createServer(app);
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);
// init socket connection
io.on('connection', socket.onConnect);

httpServer.listen(PORT, console.log("Server is running on port ", PORT))
// httpServer.listen(PORT)
