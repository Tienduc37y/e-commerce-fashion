import React, { useEffect, useState } from 'react';
import MainCarousel from "../../components/HomeCarousel/MainCarousel";
import HomeSectionList from "../../components/HomeSectionList/HomeSectionList";
import PolicyProductSection from "../../components/PolicyProduct/PolicyProductSection";
import { getThirdLevelCategory } from "../../../redux/Category/Action";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../../../redux/Product/Action";
import VoucherList from '../../components/VoucherList/VoucherList';
import NewProductHomeSection from '../../components/NewProductHome/NewProductHomeSection';
import FeedbackForm from '../../components/Feedback/FeedbackForm';
import ParallaxSection from '../../components/ParallaxSection/ParallaxSection';
import BestSellerSection from '../../components/BestSeller/BestSellerSection';
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const HomePage = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(store => store.categories);
    const [products, setProducts] = useState({
        bestSeller: [],
        categorized: [],
    });
    const [loading, setLoading] = useState(true);

    // Tạo hàm chung để tạo request data
    const createRequestData = (sort = '', category = '', pageSize = 8) => ({
        topLevelCategory: "",
        secondLevelCategory: "",
        thirdLevelCategory: category,
        colors: [],
        sizes: [],
        minPrice: 0,
        maxPrice: 100000000000,
        minDiscount: 0,
        sort,
        pageNumber: 1,
        pageSize,
        stock: ""
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch categories trước
                await dispatch(getThirdLevelCategory());
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };
        fetchAllData();
    }, [dispatch]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            if (!categories?.length) return;

            try {
                setLoading(true);

                // Random chọn 5 categories trước khi fetch
                const randomCategories = shuffleArray([...categories]).slice(0, 5);

                // Fetch song song best seller và sản phẩm theo category
                const [bestSellerResponse, ...categoryResponses] = await Promise.all([
                    // Fetch best seller products
                    dispatch(findProducts(createRequestData('best_selling'))),
                    
                    // Chỉ fetch 5 categories đã random
                    ...randomCategories.map(category => 
                        dispatch(findProducts(createRequestData('price_low', category.slugCategory)))
                    )
                ]);

                // Xử lý kết quả với kiểm tra null/undefined
                const categorizedProducts = categoryResponses
                    .filter(response => response && response.content)
                    .map((response, index) => ({
                        category: randomCategories[index], // Sử dụng randomCategories thay vì categories
                        products: response.content || []
                    }))
                    .filter(item => item.products.length > 0);

                setProducts({
                    bestSeller: bestSellerResponse?.content || [],
                    categorized: categorizedProducts
                });
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                setProducts({
                    bestSeller: [],
                    categorized: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, [categories, dispatch]);

    return (
        <div className="overflow-x-hidden">
            <MainCarousel/>
            <div>
                <PolicyProductSection />
            </div>
            <div className="container mx-auto px-4 md:px-8 lg:px-20">
                <div className="py-6 sm:py-8">
                    <VoucherList />
                </div>

                {/* Best Seller Section */}
                <div className="py-6 sm:py-8">
                    <div className="mb-6 sm:mb-8">
                        <BestSellerSection 
                            data={products.bestSeller} 
                            loading={loading}
                        />
                    </div>
                </div>

                <div className="py-6 sm:py-8">
                    <NewProductHomeSection />
                </div>

                {/* Categorized Products Sections */}
                <div className="py-6 sm:py-8">
                    {loading ? (
                        <div className="mb-6 sm:mb-8">
                            <HomeSectionList loading={true} />
                        </div>
                    ) : (
                        products.categorized?.length > 0 && (
                            products.categorized
                                .filter(({ products }) => products?.length > 0)
                                .map(({ category, products }, index, array) => (
                                    <div 
                                        key={`${category._id}-${index}`} 
                                        className={index !== array.length - 1 ? "mb-6 sm:mb-8" : ""}
                                    >
                                        <HomeSectionList 
                                            data={products}
                                            categoryName={category.name}
                                            loading={false}
                                        />
                                    </div>
                                ))
                        )
                    )}
                </div>
            </div>
            <div className="py-6 sm:py-8">
                <ParallaxSection />
            </div>
            <div className="container mx-auto px-4 md:px-8 lg:px-20">
                <div className="py-6 sm:py-8">
                    <div className="border-t border-gray-200">
                        <FeedbackForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
