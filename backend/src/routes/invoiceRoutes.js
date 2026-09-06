const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/order/:orderId', invoiceController.getInvoiceByOrderId);

module.exports = router;
