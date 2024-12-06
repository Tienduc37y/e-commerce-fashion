const Review = require('../models/review.model')
const Product = require('../models/product.model')
const productService = require('../services/product.service')

async function createReview(reqData, user, files) {
    const product = await productService.findProductById(reqData.productId);
    
    // Lấy các URL ảnh từ files đã upload
    const imageUrls = files ? files.map(file => file.path) : [];
    
    const review = new Review({
        user: user.userId,
        product: product._id,
        review: reqData.review,
        rating: reqData.rating,
        imgUrl: imageUrls,
        createdAt: new Date()
    })
    
    return await review.save()
}

async function getAllReview(productId) {
    return await Review.find({ product: productId })
        .populate({
            path: "user",
            select: "name email"
        })
        .populate({
            path: "product",
            select: "title variants",
            transform: doc => ({
                title: doc.title,
                image: doc.variants && doc.variants.length > 0 
                    ? doc.variants[0].imageUrl  // Lấy imageUrl từ variant đầu tiên
                    : null
            })
        })
        .sort({ createdAt: -1 });
}

async function getAllReviewsAdmin() {
    return await Review.find()
        .populate({
            path: "user",
            select: "name email"
        })
        .populate({
            path: "product",
            select: "title variants", // Lấy title và variants
            transform: doc => ({
                title: doc.title,
                image: doc.variants && doc.variants.length > 0 
                    ? doc.variants[0].imageUrl  // Lấy imageUrl từ variant đầu tiên
                    : null
            })
        })
        .sort({ createdAt: -1 });
}

async function replyToReview(reviewId, replyText) {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Không tìm thấy đánh giá');
    }
    
    review.reply = replyText;
    return await review.save();
}

async function updateReplyReview(reviewId, replyText) {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Không tìm thấy đánh giá');
    }
    
    if (!review.reply) {
        throw new Error('Chưa có phản hồi để cập nhật');
    }
    
    review.reply = replyText;
    return await review.save();
}

async function deleteReplyReview(reviewId) {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Không tìm thấy đánh giá');
    }
    
    if (!review.reply) {
        throw new Error('Không có phản hồi để xóa');
    }
    
    review.reply = null;
    return await review.save();
}

async function findReviewByProduct(title) {
    try {
        // Tìm các sản phẩm có title match với từ khóa
        const products = await Product.find({
            title: { $regex: new RegExp(title, 'i') }
        });

        if (!products || products.length === 0) {
            return [];
        }

        // Lấy tất cả productIds
        const productIds = products.map(product => product._id);

        // Tìm reviews cho các sản phẩm đó
        const reviews = await Review.find({
            product: { $in: productIds }
        })
        .populate({
            path: "user",
            select: "name email"
        })
        .populate({
            path: "product",
            select: "title variants",
            transform: doc => ({
                title: doc.title,
                image: doc.variants && doc.variants.length > 0 
                    ? doc.variants[0].imageUrl
                    : null
            })
        })
        .sort({ createdAt: -1 });

        return reviews;
    } catch (error) {
        throw new Error(`Lỗi khi tìm review: ${error.message}`);
    }
}

module.exports = {
    createReview,
    getAllReview,
    getAllReviewsAdmin,
    replyToReview,
    updateReplyReview,
    deleteReplyReview,
    findReviewByProduct
}