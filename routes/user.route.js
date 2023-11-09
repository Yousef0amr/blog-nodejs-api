const express = require("express");
const verify_user = require("../middlewares/verifyUserToken")
const userRouter = express.Router();
const userController = require('../controllers/user.controller')

userRouter.route('/')
    .get(verify_user, userController.getAllUsers);

userRouter.route('/signup')
    .post(userController.signup);

userRouter.route('/login')
    .post(userController.login);



module.exports = userRouter