require("dotenv").config();
const express = require('express')
// const mysql = require('mysql2');
const bodyparser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const errorHandler = require('./middlewares/erroHandler');

const app = express()
const port = config.PORT;
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json());

const routes = require('./routes');

app.use(cors({
    origin: "*",
}))



//test
const pool = require('./database');
// (async function get(){
//     const [rows] = await pool.query("SELECT * FROM matrimony.users");
//     return console.log(rows)
// })()


routes.forEach(route => {
    const _path = `${config.BASE_PATH}${route.path}`
    app.use(_path, route.router);
})
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})