const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');

router.get('/all', categoryController.findAllCategory);
router.get('/getThirdCategory', categoryController.findAllThirdLevelCategories);

module.exports = router;
