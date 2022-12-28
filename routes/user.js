const express = require("express");
const router = express.Router();

const {
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess
} = require("../controllers/auth.controller");

const { 
    fetchFavourites,
    removeFavourite 
} = require("../controllers/product.controller");


router.route("/:userId/favourites").get(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("readOwn", "favourite"),
    fetchFavourites
);    

router.route("/:userId/favourites/:favouriteId").delete(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("deleteOwn", "favourite"),
    removeFavourite
)

module.exports = router;