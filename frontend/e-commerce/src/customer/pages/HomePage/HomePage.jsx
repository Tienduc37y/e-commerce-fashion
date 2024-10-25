import React, { useEffect, useState } from 'react';
import MainCarousel from "../../components/HomeCarousel/MainCarousel";
import HomeSectionList from "../../components/HomeSectionList/HomeSectionList";
import NewProductHomeSection from "../../components/NewProductHome/NewProductHomeSection";
import PolicyProductSection from "../../components/PolicyProduct/PolicyProductSection";
import { getThirdLevelCategory } from "../../../redux/Category/Action";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../../../redux/Product/Action";
import { Skeleton } from '@mui/material';

const HomePage = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(store => store.categories);
    const [categorizedProducts, setCategorizedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getThirdLevelCategory());
    }, [dispatch]);

    useEffect(() => {
        const data = {
            topLevelCategory: "",
            secondLevelCategory: "",
            thirdLevelCategory: "",
            colors: [],
            sizes: [],
            minPrice: 0,
            maxPrice: 100000000000,
            minDiscount: 0,
            sort: "price_low",
            pageNumber: 1,
            pageSize: 8,
            stock: ""
        };
        const fetchProductsForCategories = async () => {
            if (categories && categories.length > 0) {
                const productsData = await Promise.all(
                    categories.map(async (category) => {
                        const products = await dispatch(findProducts({ ...data, thirdLevelCategory: category.slugCategory }));
                        return { category, products };
                    })
                );
                const filteredProductsData = productsData.filter(item => item.products && item.products.length > 0);
                setCategorizedProducts(filteredProductsData);
                setLoading(false);
            }
        };

        fetchProductsForCategories();
    }, [categories, dispatch]);

    return (
        <div>
            <MainCarousel/>
            <PolicyProductSection className="my-4 md:my-6 lg:my-8"/>
            <div className="container mx-auto pb-8 md:px-8 lg:px-20">
                <NewProductHomeSection/>
                {loading ? (
                    [1,2,3,4].map((item,index)=>(
                        <div key={index} className="px-4 md:px-0">
                    {/* Skeleton for the category name */}
                    <div className="h-8 w-1/3 bg-gray-300 mx-auto mb-4 rounded"></div>
                
                    <div className="py-8 md:px-0">
                        <div className="relative">
                            <div className="flex flex-wrap gap-y-6 -mx-2 lg:-mx-4">
                                {/* Skeleton items for loading */}
                                {Array(8).fill("").map((_, index) => (
                                    <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-2 lg:px-4">
                                        {/* Skeleton Card */}
                                        <div className="bg-white shadow rounded-lg p-4">
                                            {/* Skeleton Image */}
                                            <div className="h-40 bg-gray-300 rounded-lg mb-2"></div>
                                            {/* Skeleton Text Lines */}
                                            <div className="h-6 w-3/4 bg-gray-300 rounded mb-1"></div>
                                            <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                            </div>
                        </div>
                    ))

    
                ) : (
                    categorizedProducts.map(({ category, products }) => (
                        <HomeSectionList 
                            key={category._id} 
                            data={products}
                            categoryName={category.name}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;
