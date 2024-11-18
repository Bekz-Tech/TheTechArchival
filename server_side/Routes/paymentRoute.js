const express = require('express');
const { getPayments, createPayments } = require('../controller/paymentController');
const router = express.Router();

router.get('/api/v1/payments', getPayments);
router.post('/api/v1/payment', createPayments);

module.exports = router;
