const Category = require('../models/category.model');

const findAllCategory = async () => {
    const categories = await Category.find();
    return categories;
};

const findAllThirdLevelCategories = async () => {
    const categories = await Category.find({}, 'thirdLevelCategory');
    // Flatten the array of thirdLevelCategories
    const thirdLevelCategories = categories.reduce((acc, category) => {
        return acc.concat(category.thirdLevelCategory);
    }, []);
    // Remove duplicates
    return [...new Set(thirdLevelCategories.map(cat => cat.name))];
};

module.exports = {
    findAllCategory,
    findAllThirdLevelCategories
};