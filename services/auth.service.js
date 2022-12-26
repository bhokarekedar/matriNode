const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../database");

module.exports.registerUser = async (req, res, next) => {
  // Our register logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const findUser = `SELECT email FROM matrimony.sample where email = ?`;
    const [rows] = await pool.query(findUser, [email]);
    if (rows?.length > 0) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);
    if (encryptedPassword) {
      const token = jwt.sign({ user_id: email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      const insertUser = "INSERT INTO matrimony.sample (email, password, token) VALUES (?, ?, ?)";
      const [rows] = await pool.query(insertUser, [email, encryptedPassword, token]);
      if (rows?.insertId) {
        return res.status(201).json(rows.insertId);
      }
      else{
        next(err) 
      }
    }
  } catch (err) {
    next(err)
  }
  // Our register logic ends here
};

module.exports.loginUser = async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const userData = `SELECT email, password, token FROM matrimony.sample where email = ?`;
    
    const [user] = await pool.query(userData, [email]);
    const userPassword = user[0]?.["password"];
    if (userPassword && (await bcrypt.compare(password, userPassword))) {
      // Create token
      const token = jwt.sign(
        { user_id: email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      // save user token
      //const insertUser = "INSERT INTO matrimony.sample (token) VALUES (?) WHERE email = ?";
      const insertUser =   "UPDATE matrimony.sample SET token = ? WHERE email = ?"
      const [inserToken] = await pool.query(insertUser, [token, user[0]?.["email"]]);
      if (inserToken?.changedRows == 1) {
        return res.status(200).json(inserToken);
      }
      else{
        next(err) 
      }   
    }
   return  res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
};
