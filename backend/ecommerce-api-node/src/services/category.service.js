const Category = require('../models/category.model');

const findAllCategory = async () => {
    const categories = await Category.find();
    return categories;
};

const findAllThirdLevelCategories = async () => {
    try {
        const thirdLevelCategories = await Category.find({ level: 3 })
            .populate({
                path: 'parentCategory',
                populate: {
                    path: 'parentCategory'
                }
            });

        // Sử dụng Set để loại bỏ các bản sao
        const uniqueCategories = new Set();

        const formattedCategories = thirdLevelCategories.reduce((acc, category) => {
            const categoryKey = category.slugCategory; // Sử dụng slugCategory làm key duy nhất

            if (!uniqueCategories.has(categoryKey)) {
                uniqueCategories.add(categoryKey);

                acc.push({
                    _id: category._id,
                    name: category.name,
                    slugCategory: category.slugCategory,
                    level: category.level,
                    secondLevelCategory: {
                        _id: category.parentCategory._id,
                        name: category.parentCategory.name,
                        slugCategory: category.parentCategory.slugCategory,
                        level: category.parentCategory.level
                    },
                    topLevelCategory: {
                        _id: category.parentCategory.parentCategory._id,
                        name: category.parentCategory.parentCategory.name,
                        slugCategory: category.parentCategory.parentCategory.slugCategory,
                        level: category.parentCategory.parentCategory.level
                    }
                });
            }

            return acc;
        }, []);

        return formattedCategories;
    } catch (error) {
        console.error('Error in findAllThirdLevelCategories:', error);
        throw error;
    }
};

module.exports = {
    findAllCategory,
    findAllThirdLevelCategories
};
