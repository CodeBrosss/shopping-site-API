const express = require("express");
const router = express.Router();

const {
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess
} = require("../controllers/auth.controller");

const { 
    fetchFavourites,
} = require("../controllers/product.controller");


router.route("/:userId/favourites").get(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("readOwn", "favourite"),
    fetchFavourites
);    

module.exports = router;