const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/all', categoryController.findAllCategory);
router.get('/getThirdLevelCategory', categoryController.findAllThirdLevelCategories);

module.exports = router;
