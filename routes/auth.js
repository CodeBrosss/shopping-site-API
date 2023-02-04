const express = require("express");
const router = express.Router();
const { 
    signUp, 
    signIn,
    fetchAllUsers,
    fetchUser,
    editUser,
    changeUserPassword,
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess
} = require("../controllers/auth.controller");


router.route("/users").get(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("readAny", "profile"),
    fetchAllUsers
);

router.route("/user/:id").get(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("readAny", "profile"),
    fetchUser
);


router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/user/edit").put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("updateOwn", "profile"),
    editUser
    );

router.route("/password/edit").put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("updateOwn", "password"),
    changeUserPassword
);

module.exports = router;