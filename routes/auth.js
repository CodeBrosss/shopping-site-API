const express = require("express");
const router = express.Router();
const { 
    signUp, 
    signIn,
    fetchAllUsers,
    editUser,
    changeUserPassword,
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess
} = require("../controllers/auth.controller");


router.route("/").get(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("readAny", "profile"),
    fetchAllUsers
);


router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/user/edit").put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("updateOwn", "profile"),
    editUser
    );

router.route("/:userId/password/edit").put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("updateOwn", "password"),
    changeUserPassword
);

module.exports = router;