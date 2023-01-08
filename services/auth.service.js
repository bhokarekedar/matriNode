const express = require("express");
const bcrypt = require("bcryptjs");
generateOTP();
const jwt = require("jsonwebtoken");
const fast2sms = require("fast-two-sms");
const pool = require("../database");

function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
module.exports.registerUser = async (req, res, next) => {
  // Our register logic starts here
  try {
    // Get user input
   
    const { email, password } = req.body;
    console.log(email, password)
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
      const token = jwt.sign(
        { user_id: email, auth: 2 },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1y",
        }
      );
      const insertUser =
        "INSERT INTO matrimony.sample (email, password, token, auth) VALUES (?, ?, ?, ?)";
      const [rows] = await pool.query(insertUser, [
        email,
        encryptedPassword,
        token,
        2,
      ]);
      if (rows?.insertId) {
        return res.status(201).json(token);
      } else {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
  // Our register logic ends here
};

module.exports.forgotPassword = async (req, res, next) => {
  // Our register logic starts here
  try {
    // Get user input
    const { email } = req.body;
    // Validate user input
    if (!email) {
      return res.status(400).send("Email is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const findUser = `SELECT email, auth FROM matrimony.sample where email = ?`;
    const [userFound] = await pool.query(findUser, [email]);

    if (userFound?.length > 0) {
      const otp = generateOTP();
      const options = {authorization : process.env.SMS_API_KEY, message : `OTP To Reset Your Bhoi Mangal Vivah Password is ${otp}`,  numbers : ['8657398839']}
      const data = await fast2sms.sendMessage(options);

      if (data?.return) {
        const token = jwt.sign(
          { user_id: email, auth: userFound[0]?.auth },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
       
        const insertUser =
          "UPDATE matrimony.sample SET token = ?, otp = ? WHERE email = ?";
        const [inserToken] = await pool.query(insertUser, [token, otp, email]);
        
        if (inserToken?.changedRows == 1) {
          return res.send("SMS sent successfully.");
        }
        else {
          return res.status(403).send("Authentication Failed");
        }
      } 
      else {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
  // Our register logic ends here
};

module.exports.confirmOtp = async (req, res, next) => {
  // Our register logic starts here
  try {
    // Get user input
    const { email, otp } = req.body;
    // Validate user input
    if (!otp) {
      return res.status(400).send("Otp is required");
    }

    // Validate if user exist in our database
    const findUser = `SELECT email, auth, otp FROM matrimony.sample where email = ?`;
    const [userFound] = await pool.query(findUser, [email]);
    if (userFound?.length > 0) {
      if (userFound[0]?.["otp"] === otp) {
        const token = jwt.sign(
          { user_id: email, auth: userFound[0]?.auth },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        const insertUser =
          "UPDATE matrimony.sample SET token = ? WHERE email = ?";
        const [inserToken] = await pool.query(insertUser, [token, email]);
        if (inserToken?.changedRows == 1) {
          return res.status(200).json(token);
        } else {
          return res.status(403).send("Authentication Failed");
        }
      } else {
        return res.status(403).send("Authentication Failed");
      }

    
    }
    else{
      next(err);
    }
  } catch (err) {
    next(err);
  }
  // Our register logic ends here
};

module.exports.loginUser = async (req, res) => {
  // Our login logic starts here
  try {
    console.log(req.headers)
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(204).send("All input is required");
    }
    // Validate if user exist in our database
    const userData = `SELECT email, password, token FROM matrimony.sample where email = ?`;
    const [user] = await pool.query(userData, [email]);
    const userPassword = user[0]?.["password"];
    if(!userPassword){
      return res.status(404).send("User Not Found");
    }
    if (userPassword && (await bcrypt.compare(password, userPassword))) {
      // Create token
      const token = jwt.sign(
        { user_id: email, auth: 2 },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      // save user token
      //const insertUser = "INSERT INTO matrimony.sample (token) VALUES (?) WHERE email = ?";
      const insertUser =
        "UPDATE matrimony.sample SET token = ? WHERE email = ?";
      const [inserToken] = await pool.query(insertUser, [
        token,
        user[0]?.["email"],
      ]);
      if (inserToken?.changedRows == 1) {
        return res.status(200).json(token);
      } else {
        next(err);
      }
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
};
