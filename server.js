const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const server = express();
server.use(bodyParser.json());
const cors = require('cors');

server.use(cors());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dbcollege",
});

db.connect(function (err) {
  if (err) {
    console.log('error connecting: ' + err.stack);
  } else {
    console.log('Successfully connected');
  }
});

// Establish the port
server.listen(3001, function check(error) {
  if (error) {
    console.log("Error....!!!!");
  } else {
    console.log("Started....!!!!");
  }
});

// Create the college
server.post("/api/master_college/add", (req, res) => {
  let details = {
    COLLEGE_NAME: req.body.COLLEGE_NAME,
    COLLEGE_CODE: req.body.COLLEGE_CODE,
    COLLEGE_ACRONYM: req.body.COLLEGE_ACRONYM,
    COLLEGE_ADDRESS: req.body.COLLEGE_ADDRESS,
    COLLEGE_WEBSITE: req.body.COLLEGE_WEBSITE,
    COLLEGE_PHONE: req.body.COLLEGE_PHONE,
    COLLEGE_MAIL: req.body.COLLEGE_MAIL,
    STATUS: req.body.STATUS,
    CREATED_BY: req.body.CREATED_BY,
    CREATED_ON: req.body.CREATED_ON,
  };

  // Validate 10-digit phone number
  if (!/^\d{10}$/.test(details.COLLEGE_PHONE)) {
    return res.send({ status: false, message: "Invalid phone number. It must be 10 digits." });
  }

  let sql = "INSERT INTO master_college SET ?";
  db.query(sql, details, (error) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.send({ status: false, message: "College creation failed" });
    } else {
      res.send({ status: true, message: "College created successfully" });
    }
  });
});

// View colleges
server.get("/api/master_college/", (req, res) => {
  var sql = "SELECT * FROM master_college";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

// Check if college code exists
server.get("/api/master_college/check_code/:code", (req, res) => {
  const { code } = req.params;
  let sql = "SELECT COUNT(*) as count FROM master_college WHERE COLLEGE_CODE = ?";
  db.query(sql, [code], (error, result) => {
    if (error) {
      console.error('Error checking college code:', error);
      res.send({ status: false, message: "Error checking college code" });
    } else {
      res.send({ exists: result[0].count > 0 });
    }
  });
});

// Update the colleges
server.put("/api/master_college/update/:COLLEGE_NAME", (req, res) => {
  const { COLLEGE_CODE, COLLEGE_ACRONYM, COLLEGE_ADDRESS, COLLEGE_WEBSITE, COLLEGE_PHONE, COLLEGE_MAIL, STATUS } = req.body;
  const { COLLEGE_NAME } = req.params;

  let sql = `
  UPDATE master_college 
  SET 
    COLLEGE_CODE = ?,
    COLLEGE_ACRONYM = ?,
    COLLEGE_ADDRESS = ?,
    COLLEGE_WEBSITE = ?,
    COLLEGE_PHONE = ?,
    COLLEGE_MAIL = ?,
    STATUS = ?
  WHERE COLLEGE_NAME = ?`;

  let values = [COLLEGE_CODE, COLLEGE_ACRONYM, COLLEGE_ADDRESS, COLLEGE_WEBSITE, COLLEGE_PHONE, COLLEGE_MAIL, STATUS, COLLEGE_NAME];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error updating college details:", error);
      res.status(500).json({ status: false, message: "Error updating college details" });
    } else {
      res.json({ status: true, message: "College details updated successfully" });
    }
  });
});

// Delete college
server.delete("/api/master_college/delete/:COLLEGE_NAME", (req, res) => {
  let sql = "DELETE FROM master_college WHERE COLLEGE_NAME = ?";
  db.query(sql, [req.params.COLLEGE_NAME], (error, result) => {
    if (error) {
      console.error("Error deleting college:", error);
      res.status(500).json({ status: false, message: "Error deleting college" });
    } else {
      res.json({ status: true, message: "College deleted successfully" });
    }
  });
});
