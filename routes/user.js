const express = require("express");
const router = express.Router();

const {
    deleteUser,
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess,
} = require("../controllers/auth.controller");

const { 
    fetchFavourites,
} = require("../controllers/product.controller");


router.route("/favourites").get(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("readOwn", "favourite"),
    fetchFavourites
);    

router.route("/account/delete").delete(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("deleteOwn", "account"),
    deleteUser
)

module.exports = router;