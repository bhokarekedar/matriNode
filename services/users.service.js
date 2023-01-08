const express = require("express");
const { append } = require("express/lib/response");
const pool = require("../database");

module.exports.getAllUsers = async (req, res, next) => {
  try {
    if (req.user.auth == 1 || req.user.auth == 0) {
      //admin or paid user
      let size = 5;
      let page = req.query?.page || 0;
      let offsetBy = page * size - size || 0;
      offsetBy = offsetBy < 0 ? 0 : offsetBy;
      const users =
        "SELECT id FROM matrimony.sample ORDER BY id DESC LIMIT ? OFFSET ?";
      const [rows] = await pool.query(users, [5, offsetBy]);
      return res.send(rows);
    } else if (req.user.auth == 2) {
      //free user
      let size = 5;
      let page = req.query?.page || 0;
      let offsetBy = page * size - size || 0;
      offsetBy = offsetBy < 0 ? 0 : offsetBy;
      const users =
        "SELECT id FROM matrimony.sample ORDER BY id DESC LIMIT ? OFFSET ?";
      const [rows] = await pool.query(users, [5, offsetBy]);
      return res.send(rows);
    } else {
      return res.status(403).send("Authentication Failed");
    }
  } catch (error) {
    next(error);
  }
};

module.exports.ownProfile = async (req, res, next) => {
  try {
    if (req?.user?.user_id) {
      const users = "SELECT id FROM matrimony.sample WHERE email = ?";
      const [rows] = await pool.query(users, [req?.user?.user_id]);
      return res.send(rows[0]);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.userProfile = async (req, res, next) => {
  try {
    console.log(req.body, "nnnnn")
    const emaiLOfuser = req?.body?.id;
    if (req?.user?.user_id) {
      if (req.user.auth == 1 || req.user.auth == 0) {
        //admin or paid user
        if (emaiLOfuser) {
          const users = "SELECT email FROM matrimony.sample WHERE id = ?";
          const [rows] = await pool.query(users, [emaiLOfuser]);
          if (rows.length == 0) {
            return res.status(404).send("No User Found");
          } else {
            return res.send(rows[0]);
          }
        }
      } else if (req.user.auth == 2) {
        //free user
        const users = "SELECT email FROM matrimony.sample WHERE id = ?";
        const [rows] = await pool.query(users, [emaiLOfuser]);
        if (rows.length == 0) {
          return res.status(404).send("No User Found");
        } else {
          return res.send(rows[0]);
        }
      }
    } else {
      return res.status(403).send("Authentication Failed");
    }
  } catch (error) {
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    if (req?.user?.user_id) {
      if ("password" in req.body || "auth" in req.body) {
        return res.status(403).send("Not Authorized To do this");
      } else {
        const query =
          "Update matrimony.sample SET " +
          Object.keys(req?.body)
            .map((key) => `${key} = ?`)
            .join(", ") +
          " WHERE email = ?";
        const parameters = [...Object.values(req?.body), req?.user?.user_id];
        const [rows, meta] = await pool.query(query, parameters);
        if (rows?.changedRows == 1) {
          return res.status(200).json(`Updated Successfully`);
        } else if (rows?.changedRows == 0) {
          return res.status(200).json(`No Rows Affected`);
        } else {
          next(err);
        }
      }
    } else {
      return res.status(403).send("Authentication Failed");
    }
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    if (req?.user?.user_id) {
      const query = "Update matrimony.sample SET active, activatDeActiveDate WHERE email = ?";
      const parameters = [];
      const [rows] = await pool.query(query, parameters);
      if (rows?.changedRows == 1) {
        return res.status(200).json(`Deleted Successfully`);
      } else if (rows?.changedRows == 0) {
        return res.status(200).json(`No Rows Affected`);
      } else {
        next(err);
      }
    } else {
      return res.status(403).send("Authentication Failed");
    }
  } catch (error) {
    next(error);
  }
};
