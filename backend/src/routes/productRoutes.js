const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/recommendations', productController.getRecommendations);
router.get('/flash-sale', productController.getFlashSale);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductDetail);

module.exports = router;
