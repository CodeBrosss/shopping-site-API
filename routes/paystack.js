const express = require("express");
const router = express.Router();
const { makePayment, verifyPayment } = require("../controllers/paystack.controller");
const {
    checkIfLoggedIn,
    getHeaderToken,
} = require("../controllers/auth.controller")

router.route("/pay").post(
    getHeaderToken,
    checkIfLoggedIn,
    makePayment
);
router.route("/callback").get(verifyPayment);

module.exports = router;