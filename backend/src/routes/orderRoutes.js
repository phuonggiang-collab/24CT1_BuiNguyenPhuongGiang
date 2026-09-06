const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { optionalAuth, verifyToken } = require('../middlewares/authMiddleware');

router.post('/', optionalAuth, orderController.createOrder);
router.get('/', optionalAuth, orderController.getUserOrders);
router.get('/:id', optionalAuth, orderController.getOrderDetail);
router.patch('/:id/cancel', optionalAuth, orderController.cancelOrder);

module.exports = router;
