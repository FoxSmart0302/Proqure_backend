const express = require("express");
const app = express();
const cors = require("cors");
const { query } = require("./models/mysqlConnect");
const passport = require('./utils/passport');
require("dotenv").config();
app.use(cors());
const PORT = process.env.PORT || 5005

const payment = require("./routes/payment");
const user = require("./routes/user");
const category = require('./routes/category');
const item = require('./routes/item');
// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"));

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

app.listen(PORT, console.log("Server is running on port ", PORT))