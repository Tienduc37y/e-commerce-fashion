const express = require('express')
const router = express.Router()
const authController = require('../controller/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
router.post('/signup',authController.register)
router.post('/signin',authController.login)
router.post('/refresh-token',authController.refreshToken)
router.post('/change-password', authController.changePassword)
router.post('/get-reset-token', authController.getResetToken)
router.post('/reset-password',authController.resetPassword)


module.exports = router