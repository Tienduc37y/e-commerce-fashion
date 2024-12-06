import HomeSectionCard from "./HomeSectionCard";
import EastIcon from '@mui/icons-material/East';
import { Typography } from "@mui/material";
import './HomeSectionList.css';
import { useNavigate } from 'react-router-dom';

const HomeSectionList = ({ data, categoryName }) => {
    const navigate = useNavigate();
    
    // Lấy slug category từ sản phẩm đầu tiên trong data
    const handleViewMore = () => {
        if (data && data.length > 0) {
            const firstProduct = data[0];
            const categorySlug = firstProduct?.category?.thirdLevelCategory?.slugCategory;
            
            if (categorySlug) {
                navigate(`/third-level-category/${categorySlug}`);
            } else {
                console.error('Không tìm thấy slug category');
            }
        }
    };

    const items = data?.slice(0, 8).map((item, index) => (
        <div
            key={index}
            className="px-2 md:px-4 flex-shrink-0 w-1/2 md:w-1/2 lg:w-1/4"
        >
            <HomeSectionCard product={item} />
        </div>
    ));

    return (
        <div className="px-2 sm:px-4 md:px-0">
            {categoryName && (
                <div className="section-title-container px-2 sm:px-0">
                    <Typography 
                        variant="h4" 
                        className="section-title text-lg sm:text-xl md:text-2xl"
                    >
                        {categoryName}
                    </Typography>
                    <div className="title-underline"></div>
                </div>
            )}
            <div className="py-4 sm:py-8 md:px-0">
                <div className="relative">
                    <div className="flex flex-wrap gap-y-4 sm:gap-y-6 -mx-1 sm:-mx-2 lg:-mx-4">
                        {items}
                    </div>
                </div>
            </div>
            {categoryName && (
                <div 
                    onClick={handleViewMore} 
                className="flex justify-center mt-8"
            >
                <button 
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300 ease-in-out"
                >
                    Xem thêm
                    <EastIcon className="text-white" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomeSectionList;
