const express = require('express')
const router = express.Router()
const adminController = require('../controller/admin.controller')
const adminAuthMiddleware = require('../middlewares/adminAuth.middleware')

router.get('/get_all_user', adminAuthMiddleware, adminController.getAllUser)
router.delete('/delete_user/:id', adminAuthMiddleware, adminController.deleteUser)
router.post('/find_user', adminAuthMiddleware, adminController.findUserByName)

module.exports = router