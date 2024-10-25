const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create-zalopay-order', paymentController.createZaloPayOrder);
router.get('/zalopay-callback/:app_trans_id', paymentController.handleZaloPayCallback);

module.exports = router;
