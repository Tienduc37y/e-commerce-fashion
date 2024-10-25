const paymentService = require('../services/payment.service');

const createZaloPayOrder = async (req, res) => {
  try {
    const result = await paymentService.createZaloPayOrder(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in createZaloPayOrder:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

const handleZaloPayCallback = async (req, res) => {
  try {
    const { app_trans_id } = req.body;
    const result = await paymentService.checkOrderStatus(app_trans_id);
    res.json(result);
  } catch (error) {
    console.error('Error in checkOrderStatus:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};


module.exports = {
  createZaloPayOrder,
  handleZaloPayCallback,
};
