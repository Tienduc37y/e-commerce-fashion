const Category = require('../models/category.model')
const Product = require('../models/product.model')
const unidecode = require('unidecode')

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

async function createProduct(reqData) {
    const topLevelName = processString(reqData.topLevelCategory);
    const secondLevelName = processString(reqData.secondLevelCategory);
    const thirdLevelName = processString(reqData.thirdLevelCategory, true);

    let topLevel = await Category.findOne({name: topLevelName})

    if(!topLevel) {
        topLevel = new Category({
            name: topLevelName,
            level: 1
        })
        await topLevel.save()
    }

    let secondLevel = await Category.findOne({
        name: secondLevelName,
        parentCategory: topLevel._id
    })

    if(!secondLevel) {
        secondLevel = new Category({
            name: secondLevelName,
            parentCategory: topLevel._id,
            level: 2
        })
        await secondLevel.save()
    }

    let thirdLevel = await Category.findOne({
        name: thirdLevelName,
        parentCategory: secondLevel._id
    })

    if(!thirdLevel){
        thirdLevel = new Category({
            name: thirdLevelName,
            parentCategory: secondLevel._id,
            level: 3
        })
        await thirdLevel.save()
    } 

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
        discountedPrice: reqData.discountedPrice,
        discountedPersent: reqData.discountedPersent,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: reqData.price,
        sizes: reqData.sizes,
        quantity: reqData.quantity,
        category: thirdLevel._id,
    })

    return await product.save()
}

async function deleteProduct(productId) {
    const product = await findProductById(productId)
    await Product.findByIdAndDelete(product)
    return "Xóa sản phẩm thành công"
}

async function updateProduct(productId, reqData) {
    return await Product.findByIdAndUpdate(productId,reqData)
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
    let {category, color, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize} = reqQuery;
    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    let query = Product.find().populate('category');

    // Category filter
    if (category) {
        const existCategory = await Category.findOne({name: category});
        if (existCategory) {
            query = query.where("category").equals(existCategory._id);
        } else {
            
            return {content: [], currentPage: 1, totalPages: 0}; // Return empty response
        }
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
        query = query.where("discountedPersent").gt(minDiscount);
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