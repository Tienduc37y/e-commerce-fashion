import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findProducts } from '../../../redux/Product/Action';
import HomeSectionCard from '../HomeSectionList/HomeSectionCard';
import { Box, Container, Typography, Menu, MenuItem, Button, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ThirdLevelProduct = () => {
    const { chuoi } = useParams();
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.product);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [priceRange, setPriceRange] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [sortBy, setSortBy] = useState('default');

    // States cho menus
    const [priceAnchorEl, setPriceAnchorEl] = useState(null);
    const [sizeAnchorEl, setSizeAnchorEl] = useState(null);
    const [sortAnchorEl, setSortAnchorEl] = useState(null);

    // Thêm state cho category tab
    const [selectedCategory, setSelectedCategory] = useState('TẤT CẢ');

    const categories = [
        { label: 'TẤT CẢ', value: '' },
        { label: 'NỮ', value: 'nu' },
        { label: 'NAM', value: 'nam' }
    ];

    const priceRanges = [
        { label: 'Tất cả', value: '' },
        { label: 'Dưới 200.000đ', value: '0-200000' },
        { label: '200.000đ - 500.000đ', value: '200000-500000' },
        { label: '500.000đ - 1.000.000đ', value: '500000-1000000' },
        { label: 'Trên 1.000.000đ', value: '1000000-100000000000' }
    ];

    const sizes = [
        { label: 'Tất cả', value: '' },
        { label: 'S', value: 'S' },
        { label: 'M', value: 'M' },
        { label: 'L', value: 'L' },
        { label: 'XL', value: 'XL' },
        { label: 'XXL', value: 'XXL' }
    ];

    const sortOptions = [
        { label: 'Mặc định', value: '' },
        { label: 'Giá thấp đến cao', value: 'price_low' },
        { label: 'Giá cao đến thấp', value: 'price_high' },
        { label: 'Mới nhất', value: 'newest' }
    ];

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const updateFilters = (type, value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        
        if (value === '' || value === 'TẤT CẢ') {
            newSearchParams.delete(type);
        } else {
            newSearchParams.set(type, value);
        }
        
        setSearchParams(newSearchParams);
    };

    useEffect(() => {
        const price = searchParams.get('price') || '';
        const size = searchParams.get('size') || '';
        const sort = searchParams.get('sort') || '';
        const category = 'TẤT CẢ';

        setPriceRange(price);
        setSelectedSize(size);
        setSortBy(sort);
        setSelectedCategory(category);
    }, []);

    console.log(filteredProducts)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let [minPrice, maxPrice] = priceRange ? priceRange.split('-').map(Number) : [0, 100000000000];
                
                const reqData = {
                    colors: '',
                    sizes: selectedSize,
                    minPrice,
                    maxPrice,
                    minDiscount: 0,
                    topLevelCategory: categories.find(cat => cat.label === selectedCategory)?.value || '',
                    secondLevelCategory: '',
                    thirdLevelCategory: chuoi,
                    stock: '',
                    sort: sortBy,
                    pageNumber: 1,
                    pageSize: 1000
                };

                const response = await dispatch(findProducts(reqData));
                
                if (response?.content) {
                    setFilteredProducts(response.content);
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };

        if (chuoi) {
            fetchProducts();
        }
    }, [dispatch, chuoi, priceRange, selectedSize, sortBy, selectedCategory]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Container maxWidth="xl" className="py-4 sm:py-8">
            {/* Category Tabs */}
            <Box className="mb-4 sm:mb-6 overflow-x-auto">
                <Box className="flex justify-start sm:justify-center min-w-max">
                    {categories.map((category) => (
                        <Box
                            key={category.value}
                            onClick={() => {
                                setSelectedCategory(category.label);
                                updateFilters('category', category.value);
                            }}
                            className={`
                                px-4 sm:px-24 py-2 cursor-pointer relative text-center mx-2 sm:mx-4
                                ${selectedCategory === category.label 
                                    ? 'bg-white text-[#ee4d2d] font-medium' 
                                    : 'bg-[#f5f5f5] text-gray-500 hover:text-gray-700'
                                }
                                transition-all duration-200 text-sm sm:text-base
                            `}
                            sx={{
                                '&:hover': {
                                    color: '#ee4d2d',
                                },
                                borderRadius: '4px',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: selectedCategory === category.label ? '#ee4d2d' : 'transparent',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            {category.label}
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Filters */}
            <Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 sm:mb-6 gap-4 sm:gap-0">
                <Box className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <Typography className="text-gray-600 mr-2 text-sm sm:text-base">BỘ LỌC:</Typography>
                    
                    {/* Price Filter */}
                    <Button
                        className="text-gray-700 min-w-[120px] justify-between border border-gray-300 hover:border-gray-400 text-sm sm:text-base"
                        onClick={(e) => setPriceAnchorEl(e.currentTarget)}
                        endIcon={<KeyboardArrowDownIcon />}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px sm:6px 12px',
                            flex: '1 1 auto',
                            sm: { flex: '0 0 auto' }
                        }}
                    >
                        {priceRanges.find(range => range.value === priceRange)?.label || 'Khoảng giá'}
                    </Button>

                    {/* Size Filter */}
                    <Button
                        className="text-gray-700 min-w-[100px] sm:min-w-[120px] justify-between border border-gray-300 hover:border-gray-400 text-sm sm:text-base"
                        onClick={(e) => setSizeAnchorEl(e.currentTarget)}
                        endIcon={<KeyboardArrowDownIcon />}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px sm:6px 12px',
                            flex: '1 1 auto',
                            sm: { flex: '0 0 auto' }
                        }}
                    >
                        {sizes.find(size => size.value === selectedSize)?.label || 'Kích cỡ'}
                    </Button>
                </Box>

                {/* Sort Option */}
                <Box className="w-full sm:w-auto">
                    <Button
                        className="text-gray-700 w-full sm:min-w-[150px] justify-between border border-gray-300 hover:border-gray-400 text-sm sm:text-base"
                        onClick={(e) => setSortAnchorEl(e.currentTarget)}
                        endIcon={<KeyboardArrowDownIcon />}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px sm:6px 12px'
                        }}
                    >
                        {sortOptions.find(option => option.value === sortBy)?.label || 'Sắp xếp theo'}
                    </Button>
                </Box>
            </Box>

            {/* Menus */}
            <Menu
                anchorEl={priceAnchorEl}
                open={Boolean(priceAnchorEl)}
                onClose={() => setPriceAnchorEl(null)}
                PaperProps={{
                    style: {
                        maxHeight: '300px',
                        width: '200px'
                    }
                }}
            >
                {priceRanges.map((range) => (
                    <MenuItem
                        key={range.value}
                        onClick={() => {
                            setPriceRange(range.value);
                            setPriceAnchorEl(null);
                            updateFilters('price', range.value);
                        }}
                        selected={priceRange === range.value}
                        className="text-sm sm:text-base"
                    >
                        {range.label}
                    </MenuItem>
                ))}
            </Menu>

            <Menu
                anchorEl={sizeAnchorEl}
                open={Boolean(sizeAnchorEl)}
                onClose={() => setSizeAnchorEl(null)}
                PaperProps={{
                    style: {
                        maxHeight: '300px',
                        width: '150px'
                    }
                }}
            >
                {sizes.map((size) => (
                    <MenuItem
                        key={size.value}
                        onClick={() => {
                            setSelectedSize(size.value);
                            setSizeAnchorEl(null);
                            updateFilters('size', size.value);
                        }}
                        selected={selectedSize === size.value}
                        className="text-sm sm:text-base"
                    >
                        {size.label}
                    </MenuItem>
                ))}
            </Menu>

            <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => setSortAnchorEl(null)}
                PaperProps={{
                    style: {
                        maxHeight: '300px',
                        width: '200px'
                    }
                }}
            >
                {sortOptions.map((option) => (
                    <MenuItem
                        key={option.value}
                        onClick={() => {
                            setSortBy(option.value);
                            setSortAnchorEl(null);
                            updateFilters('sort', option.value);
                        }}
                        selected={sortBy === option.value}
                        className="text-sm sm:text-base"
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>

            {/* Products Grid */}
            {filteredProducts && filteredProducts.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                            <HomeSectionCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box className="text-center py-8 sm:py-12">
                    <Typography variant="h6" color="text.secondary" className="text-sm sm:text-base">
                        Không tìm thấy sản phẩm nào trong danh mục này
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default ThirdLevelProduct;