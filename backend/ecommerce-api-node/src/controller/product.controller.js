const productService = require('../services/product.service')

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body)
        return res.status(201).send({
            status: "201",
            message: "Tạo sản phẩm thành công",
            product
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id
    try {
        const product = await productService.deleteProduct(productId)
        return res.status(201).send({
            status: "201",
            message: "Xóa sản phẩm thành công",
            product
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    const productId = req.params.id
    try {
        const product = await productService.updateProduct(productId, req.body)
        return res.status(201).send({
            status: "201",
            message: "Cập nhật sản phẩm thành công",
            product
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const findProductById = async (req, res) => {
    const productId = req.params.id
    try {
        const products = await productService.findProductById(productId)
        return res.status(201).send({
            status: "201",
            message: "Lấy sản phẩm thành công",
            products
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query)
        console.log(products.content)
        
        return res.status(201).send({
            status: "201",
            message: "Lấy sản phẩm thành công",
            products
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const createMultipleProduct = async (req, res) => {
    try {
        const products = await productService.createMultipleProduct(req.body)
        return res.status(201).send({
            status: "201",
            message: "Tạo sản phẩm thành công multiple",
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}
module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    createMultipleProduct,
    findProductById
}
