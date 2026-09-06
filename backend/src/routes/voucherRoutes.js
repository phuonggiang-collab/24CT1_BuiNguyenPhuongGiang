const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');

router.get('/', voucherController.getVouchers);
router.post('/apply', voucherController.applyVoucher);

module.exports = router;
