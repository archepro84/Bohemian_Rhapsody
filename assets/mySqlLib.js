const mysql = require("mysql");
require('dotenv').config();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "Bohemian_Rhapsody",
})

connection.connect();

module.exports = connection;