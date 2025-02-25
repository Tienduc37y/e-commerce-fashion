import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeSectionCard from '../HomeSectionList/HomeSectionCard';
import { Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

// Custom arrows cho slider
const NextArrow = ({ onClick }) => {
    return (
        <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-200"
            onClick={onClick}
            style={{ right: '-15px' }}
        >
            <ArrowForwardIosIcon className="text-gray-600" />
        </div>
    );
};

const PrevArrow = ({ onClick }) => {
    return (
        <div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-200"
            onClick={onClick}
            style={{ left: '-15px' }}
        >
            <ArrowBackIosNewIcon className="text-gray-600" />
        </div>
    );
};

const BestSellerSection = ({ data, loading }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    // Nếu đang loading, hiển thị skeleton
    if (loading) {
        return (
            <div>
                <div className="section-title-container">
                    <Typography 
                        variant="h4" 
                        className="section-title text-lg sm:text-xl md:text-2xl"
                    >
                        Sản phẩm bán chạy
                    </Typography>
                    <div className="title-underline"></div>
                </div>
                
                <div className="py-4 sm:py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="animate-pulse">
                                <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Nếu không có data hoặc data rỗng, không hiển thị gì cả
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="section-title-container">
                <Typography 
                    variant="h4" 
                    className="section-title text-lg sm:text-xl md:text-2xl"
                >
                    Sản phẩm bán chạy
                </Typography>
                <div className="title-underline"></div>
            </div>
            
            <div className="py-4 sm:py-8">
                <div className="relative">
                    <Slider {...settings}>
                        {data.map((product, index) => (
                            <div key={`bestseller-${product._id}-${index}`} className="px-2">
                                <HomeSectionCard product={product} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default BestSellerSection; 