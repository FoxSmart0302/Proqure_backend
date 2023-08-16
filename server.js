const express = require("express")
const app = express()
const cors = require("cors")
const { connection } = require("./models/mysqlConnect")
require("dotenv").config()

const PORT = process.env.PORT || 5005

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"));

// For pool initialization, see above
connection.connect(function (err) {
    if (err) {
        console.log("Db connection failed", err);
        throw err;
    }
    console.log("Db connection successful");
})

app.use('/api/items', require("./routes/items"))
app.use('/api/payment', cors(), require("./routes/payment"))

app.listen(PORT, console.log("Server is running on port ", PORT))