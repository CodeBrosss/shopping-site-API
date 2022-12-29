const express = require("express");
const router = express.Router();
const { makePayment, verifyPayment } = require("../controllers/paystack.controller");

router.route("/pay").post(makePayment);
router.route("/callback").get(verifyPayment);

module.exports = router;