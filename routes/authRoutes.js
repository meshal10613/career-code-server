const express = require("express");
const router = express.Router();
const { createJwt } = require("../controllers/authController");

router.post("/jwt", createJwt);

module.exports = router;
