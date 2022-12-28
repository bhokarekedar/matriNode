const express = require('express');
const { append } = require('express/lib/response');
const pool = require('../database');

module.exports.getAllUsers = async (req, res) => {
    try {
        if(req.user.auth == 1 || req.user.auth == 0){
            //admin or paid user
        const users = `SELECT email FROM matrimony.sample`;
        const [rows] = await pool.query(users);
        console.log(rows[0])
        return res.send(rows)
        }
        else if(req.user.auth == 2 ){
            //free user
            const users = `SELECT email FROM matrimony.sample`;
            const [rows] = await pool.query(users);
            console.log(rows[0])
            return res.send(rows[0])
        }
        else{
            return res.status(403).send("Authentication Failed");
        }

    } catch (error) {
        
    }
}