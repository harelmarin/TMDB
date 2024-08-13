const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const dotenv = require('dotenv');


app = express();
app.use(cors());



const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Database zerbee connected');
    }
});



app.listen(8001, () => {
    console.log('Server is running on port 8001');
});




