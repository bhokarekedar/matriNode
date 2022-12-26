const express = require('express')
const pool = require('../database');


module.exports.getAllUsers = async (req, res) => {
    try {
        console.log("first")
        const [rows] = await pool.query("call matrimony.get_all_users()");
        console.log(rows[0])
        return res.send(rows[0])

    } catch (error) {
        
    }
}