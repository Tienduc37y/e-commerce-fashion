const productService = require('../services/product.service')

const createProduct = async (req, res) => {
    try {
        let productData = req.body;

        if (typeof productData.sizes === 'string') {
            productData.sizes = JSON.parse(productData.sizes);
        }

        if (req.files && req.files.length > 0) {
            productData.imageUrl = req.files.map((file, index) => {
                return {
                    color: productData.color[index] || 'default',
                    image: file.path
                };
            });
        } else if (productData.imageUrl && typeof productData.imageUrl === 'string') {
            try {
                productData.imageUrl = JSON.parse(productData.imageUrl);
            } catch (error) {
                console.error('Error parsing imageUrl:', error);
                productData.imageUrl = [{ color: productData.color[0] || 'default', image: productData.imageUrl }];
            }
        }

        // Đảm bảo mỗi imageUrl có trường color
        if (Array.isArray(productData.imageUrl)) {
            productData.imageUrl = productData.imageUrl.map((img, index) => {
                if (typeof img === 'string') {
                    return { color: productData.color[index] || 'default', image: img };
                }
                return img.color ? img : { ...img, color: productData.color[index] || 'default' };
            });
        }

        delete productData.color;

        const product = await productService.createProduct(productData);
        res.status(201).send({
            status: "201",
            message: "Tạo sản phẩm thành công",
            product
        });
    } catch (error) {
        res.status(500).send({
            status: "500",
            error: error.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    const productId = req.params.id
    try {
        const product = await productService.deleteProduct(productId)
        return res.status(200).send({
            status: "200",
            message: product,
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
        return res.status(200).send({
            status: "200",
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

const findProductByName = async (req, res) => {
    const { productName } = req.body
    if (!productName) {
        return res.status(400).send({
            status: "400",
            error: "Tên sản phẩm là bắt buộc"
        })
    }
    try {
        const products = await productService.findProductByName(productName)
        return res.status(200).send({
            status: "200",
            message: "Lấy sản phẩm thành công",
            products
        })
    } catch (error) {
        return res.status(404).send({
            status: "404",
            error: error.message
        })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query)
        
        return res.status(200).send({
            status: "200",
            message: "Lấy sản phẩm thành công",
            data : products
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
    findProductByName,
    createMultipleProduct,
    findProductById
}
