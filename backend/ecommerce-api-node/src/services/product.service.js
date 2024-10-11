const Category = require('../models/category.model')
const Product = require('../models/product.model')
const unidecode = require('unidecode')
const { cloudinary } = require('../config/cloudinary');

function processString(str, isThirdLevel = false) {
    let processed = unidecode(str).toLowerCase();
    processed = processed.trim();
    if (isThirdLevel) {
        processed = processed.replace(/\s+/g, '_');
    } else {
        processed = processed.replace(/\s+/g, '');
    }
    return processed;
}

function processColorString(str) {
    return unidecode(str).toLowerCase().trim().replace(/\s+/g, '_');
}

function roundToInteger(number) {
    return Math.round(number);
}

async function createProduct(reqData) {
    const topLevel = processString(reqData.topLevelCategory);
    const secondLevel = processString(reqData.secondLevelCategory);
    const thirdLevel = processString(reqData.thirdLevelCategory, true);

    let category = await Category.findOne();
    if (!category) {
        category = new Category({
            topLevelCategory: [{ name: topLevel }],
            secondLevelCategory: [{ name: secondLevel }],
            thirdLevelCategory: [{ name: thirdLevel }]
        });
    } else {
        if (!category.topLevelCategory.some(item => item.name === topLevel)) {
            category.topLevelCategory.push({ name: topLevel });
        }
        if (!category.secondLevelCategory.some(item => item.name === secondLevel)) {
            category.secondLevelCategory.push({ name: secondLevel });
        }
        if (!category.thirdLevelCategory.some(item => item.name === thirdLevel)) {
            category.thirdLevelCategory.push({ name: thirdLevel });
        }
    }
    await category.save();

    if (reqData.sizes && Array.isArray(reqData.sizes)) {
        reqData.sizes = reqData.sizes.map(size => ({
            ...size,
            colors: size.colors.map(color => ({
                ...color,
                color: processColorString(color.color)
            }))
        }));
    }

    if (reqData.imageUrl && Array.isArray(reqData.imageUrl)) {
        reqData.imageUrl = reqData.imageUrl.map(img => ({
            ...img,
            color: processColorString(img.color)
        }));
    }

    const product = new Product({
        title: reqData.title,
        description: reqData.description,
        discountedPrice: roundToInteger(reqData.discountedPrice),
        discountedPersent: reqData.discountedPersent,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: roundToInteger(reqData.price),
        sizes: reqData.sizes,
        quantity: reqData.quantity,
        category: {
            topLevelCategory: topLevel,
            secondLevelCategory: secondLevel,
            thirdLevelCategory: thirdLevel
        },
    })

    return await product.save()
}

async function deleteProduct(productId) {
    const product = await findProductById(productId)
    
    if (product.imageUrl && Array.isArray(product.imageUrl)) {
        for (let img of product.imageUrl) {
            if (img.image) {
                try {
                    const publicId = img.image.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    console.error('Lỗi khi xóa ảnh từ Cloudinary:', error);
                }
            }
        }
    }
    await Product.findByIdAndDelete(product._id)
    return "Xóa sản phẩm và ảnh liên quan thành công"
}

async function updateProduct(productId, reqData) {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
    }
    
    const topLevel = processString(reqData.category.topLevelCategory);
    const secondLevel = processString(reqData.category.secondLevelCategory);
    const thirdLevel = processString(reqData.category.thirdLevelCategory, true);

    let category = await Category.findOne();
    if (!category) {
            category = new Category({
                topLevelCategory: [{ name: topLevel }],
                secondLevelCategory: [{ name: secondLevel }],
                thirdLevelCategory: [{ name: thirdLevel }]
            });
    } else {
        if (!category.topLevelCategory.some(item => item.name === topLevel)) {
            category.topLevelCategory.push({ name: topLevel });
        }
        if (!category.secondLevelCategory.some(item => item.name === secondLevel)) {
            category.secondLevelCategory.push({ name: secondLevel });
        }
        if (!category.thirdLevelCategory.some(item => item.name === thirdLevel)) {
            category.thirdLevelCategory.push({ name: thirdLevel });
        }
    }
    await category.save();

    // Xử lý sizes và colors
    if (reqData.sizes && Array.isArray(reqData.sizes)) {
        reqData.sizes = reqData.sizes.map(size => ({
            ...size,
            colors: size.colors.map(color => ({
                ...color,
                color: processColorString(color.color)
            }))
        }));
    }

    // Xử lý imageUrl
    if (reqData.imageUrl && Array.isArray(reqData.imageUrl)) {
        reqData.imageUrl = reqData.imageUrl.map(img => ({
            ...img,
            color: processColorString(img.color)
        }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
        title: reqData.title,
        description: reqData.description,
        discountedPrice: roundToInteger(reqData.discountedPrice),
        discountedPersent: reqData.discountedPersent,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: roundToInteger(reqData.price),
        sizes: reqData.sizes,
        quantity: reqData.quantity,
        category: {
            topLevelCategory: topLevel,
            secondLevelCategory: secondLevel,
            thirdLevelCategory: thirdLevel
        },
    }, { new: true });
    return updatedProduct;
}

async function findProductById(productId) {
    const product = await Product.findById(productId).populate('category').exec()
    if(!product){
        throw new Error("Không có sản phẩm")
    }
    return product
}

async function findProductByName(productName) {
    const normalizedSearchTerm = unidecode(productName).toLowerCase();

    const products = await Product.find().populate('category');

    const filteredProducts = products.filter(product => 
        unidecode(product.title).toLowerCase().includes(normalizedSearchTerm)
    );

    if (filteredProducts.length === 0) {
        throw new Error("Không có sản phẩm");
    }
    return filteredProducts;
}

async function getAllProducts(reqQuery) {
    let {topLevelCategory, secondLevelCategory, thirdLevelCategory, color, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize} = reqQuery;
    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    let query = Product.find();

    // Category filter
    if (topLevelCategory && secondLevelCategory && thirdLevelCategory) {
        query = query.where({
            "category.topLevelCategory": topLevelCategory,
            "category.secondLevelCategory": secondLevelCategory,
            "category.thirdLevelCategory": thirdLevelCategory
        });
    }

    // Color filter
    if (color) {
        const colorSet = new Set(color.split(",").map(c => c.trim().toLowerCase()));
        if (colorSet.size > 0) {
            const colorRegex = new RegExp([...colorSet].join("|"), "i");
            query = query.where("sizes.colors.color").regex(colorRegex);
        }
    }

    // Size filter
    if (sizes) {
        const sizesSet = new Set(sizes.split(",").map(s => s.trim()));
        query = query.where("sizes.size").in([...sizesSet]);
    }

    // Price filter
    if (minPrice && maxPrice) {
        query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
    }

    // Discount filter
    if (minDiscount) {
        query = query.where("discountedPersent").gte(minDiscount);
    }    

    // Stock filter
    if (stock) {
        if (stock === 'in_stock') {
            query = query.where("quantity").gt(0);
        } else if (stock === 'out_stock') {
            query = query.where("quantity").lte(0);
        }
    }

    // Sorting
    if (sort) {
        const sortDirection = sort === "price_high" ? -1 : 1;
        query = query.sort({discountedPrice: sortDirection});
    }

    // Pagination
    const totalProducts = await Product.countDocuments(query);
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);

    // Execute the query
    const products = await query.exec();
    const totalPages = Math.ceil(totalProducts / pageSize);

    return {
        content: products,
        currentPage: pageNumber,
        totalPages
    };
}

async function createMultipleProduct(products) {
    for(let product of products) {
        await createProduct(product)
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    findProductById,
    findProductByName,
    createMultipleProduct
}