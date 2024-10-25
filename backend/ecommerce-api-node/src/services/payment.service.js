const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const orderService = require('../services/order.service');
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const createZaloPayOrder = async (dataOrder) => {
  try {
    const orderInfo = await orderService.findOrderById(dataOrder.orderId);
    
    if (!orderInfo) {
      throw new Error(`Order with ID ${dataOrder.orderId} not found`);
    }

    const productinfo = orderInfo.orderItems.map(item => ({
      itemid: item.product._id,
      itemname: item.product.name,
      itemprice: item.product.discountedPrice,
      itemquantity: item.quantity
    }));

    const embed_data = {
      redirecturl: `http://localhost:5173/order-success/${dataOrder.orderId}`,
      orderId: dataOrder.orderId
    };

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: orderInfo.user.username,
      app_time: Date.now(),
      item: JSON.stringify(productinfo),
      embed_data: JSON.stringify(embed_data),
      amount: orderInfo.totalDiscountedPrice,
      callback_url: 'http://localhost:5000/api/payment/zalopay-callback', // Cập nhật callback_url
      description: `Thanh toán cho đơn hàng #${orderInfo._id}`,
      bank_code: "",
    };

    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order });
    return response.data;
  } catch (error) {
    console.error('Error creating ZaloPay order:', error.message);
    if (error.response) {
      console.error('ZaloPay API error response:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

const checkOrderStatus = async (app_trans_id) => {
  const postData = {
    app_id: config.app_id,
    app_trans_id,
  };

  const data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  const postConfig = {
    method: 'post',
    url: 'https://sb-openapi.zalopay.vn/v2/query',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(postData),
  };

  try {
    const response = await axios(postConfig);
    return response.data;
  } catch (error) {
    console.error('Error checking order status:', error);
    throw error;
  }
};

module.exports = {
  createZaloPayOrder,
  checkOrderStatus,
  config
};
