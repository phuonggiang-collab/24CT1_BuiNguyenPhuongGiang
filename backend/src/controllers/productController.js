const db = require('../config/db');

// Lấy danh sách sản phẩm có phân trang & bộ lọc đa dạng
exports.getProducts = (req, res) => {
  try {
    let { category_id, min_price, max_price, rating, sort_by, is_flash_sale, limit, page } = req.query;

    let list = [...db.products];

    // Lọc danh mục
    if (category_id && category_id !== 'all') {
      list = list.filter(p => p.category_id === Number(category_id));
    }

    // Lọc giá
    if (min_price) {
      list = list.filter(p => p.sale_price >= Number(min_price));
    }
    if (max_price) {
      list = list.filter(p => p.sale_price <= Number(max_price));
    }

    // Lọc đánh giá sao
    if (rating) {
      list = list.filter(p => p.rating_avg >= Number(rating));
    }

    // Lọc Flash sale
    if (is_flash_sale === 'true' || is_flash_sale === true) {
      list = list.filter(p => p.is_flash_sale);
    }

    // Sắp xếp
    if (sort_by === 'price_asc') {
      list.sort((a, b) => a.sale_price - b.sale_price);
    } else if (sort_by === 'price_desc') {
      list.sort((a, b) => b.sale_price - a.sale_price);
    } else if (sort_by === 'best_seller') {
      list.sort((a, b) => b.sold_quantity - a.sold_quantity);
    } else if (sort_by === 'newest') {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      // Mặc định: Phổ biến nhất (kết hợp bán chạy + rating)
      list.sort((a, b) => (b.sold_quantity * 0.7 + b.rating_avg * 100) - (a.sold_quantity * 0.7 + a.rating_avg * 100));
    }

    const total = list.length;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = list.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      products: paginatedItems
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Tìm kiếm sản phẩm thông minh kèm gợi ý từ khóa
exports.searchProducts = (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(200).json({ success: true, suggestions: [], products: [] });
    }

    const query = q.toLowerCase().trim();
    const matchedProducts = db.products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );

    // Gợi ý từ khóa
    const suggestions = matchedProducts.slice(0, 5).map(p => p.name);

    return res.status(200).json({
      success: true,
      query: q,
      totalMatches: matchedProducts.length,
      suggestions,
      products: matchedProducts
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Thuật toán Đề Xuất Thông Minh Cho Bạn (Personalized Recommendations)
// Logic: Ưu tiên sản phẩm cùng danh mục đã xem gần đây + Sản phẩm có doanh số bán cao và rating 4.8+
exports.getRecommendations = (req, res) => {
  try {
    const { category_id, exclude_id } = req.query;
    let pool = [...db.products];

    if (exclude_id) {
      pool = pool.filter(p => p.id !== Number(exclude_id));
    }

    let recommended = [];

    if (category_id) {
      // 1. Lấy sản phẩm cùng danh mục
      const sameCategory = pool.filter(p => p.category_id === Number(category_id));
      recommended.push(...sameCategory);
    }

    // 2. Bổ sung các sản phẩm bán chạy nhất toàn sàn
    const topSellers = pool
      .filter(p => !recommended.some(r => r.id === p.id))
      .sort((a, b) => b.sold_quantity - a.sold_quantity);

    recommended.push(...topSellers);

    // Thuật toán tính điểm đề xuất (Recommendation Score)
    recommended = recommended.map(item => {
      const discountPercent = Math.round(((item.original_price - item.sale_price) / item.original_price) * 100);
      const score = (item.sold_quantity * 0.5) + (item.rating_avg * 80) + (discountPercent * 2);
      return { ...item, recommendation_score: score };
    });

    return res.status(200).json({
      success: true,
      algorithm: 'Hybrid: Category Affinity + Sales Velocity + Rating Weight',
      count: recommended.length,
      products: recommended
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách Flash Sale
exports.getFlashSale = (req, res) => {
  try {
    const flashItems = db.products
      .filter(p => p.is_flash_sale)
      .map(p => {
        const discountPercent = Math.round(((p.original_price - p.sale_price) / p.original_price) * 100);
        return {
          ...p,
          discount_percent: discountPercent,
          progress_percent: Math.min(95, Math.round((p.sold_quantity / (p.sold_quantity + p.stock_quantity)) * 100))
        };
      });

    return res.status(200).json({
      success: true,
      flashSaleEndsAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 tiếng tới
      products: flashItems
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Chi tiết sản phẩm
exports.getProductDetail = (req, res) => {
  try {
    const { id } = req.params;
    const product = db.products.find(p => p.id === Number(id));

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    const category = db.categories.find(c => c.id === product.category_id);
    const relatedProducts = db.products
      .filter(p => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 6);

    return res.status(200).json({
      success: true,
      product: {
        ...product,
        category_name: category ? category.name : 'Khác',
        discount_percent: Math.round(((product.original_price - product.sale_price) / product.original_price) * 100)
      },
      relatedProducts
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh mục
exports.getCategories = (req, res) => {
  try {
    const categoriesWithCount = db.categories.map(c => ({
      ...c,
      product_count: db.products.filter(p => p.category_id === c.id).length
    }));

    return res.status(200).json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
