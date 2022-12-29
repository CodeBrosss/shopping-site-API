const express = require("express");
const router = express.Router();
const { adminSignup } = require("../controllers/auth.controller");

router.route("/signup").post(adminSignup);

module.exports = router;