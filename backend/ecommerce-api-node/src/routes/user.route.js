const express = require('express')
const router = express.Router()
const userController = require('../controller/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
router.get('/profile',authMiddleware,userController.getUserProfile)
router.put('/update_user/:id',authMiddleware,userController.editUser)
module.exports = router