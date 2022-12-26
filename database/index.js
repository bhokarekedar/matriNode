const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: process.env.DEVHOST,
//     user: process.env.DEVUSER,
//     password: process.env.DEVPASSWORD,
//     database: process.env.DEVDATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// }).promise();

const pool = mysql.createConnection({
      host: process.env.DEVHOST,
    user: process.env.DEVUSER,
    password: process.env.DEVPASSWORD,
    database: process.env.DEVDATABASE,
  }).promise();


module.exports = pool;