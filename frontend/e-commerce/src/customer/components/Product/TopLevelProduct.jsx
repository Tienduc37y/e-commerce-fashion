import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findProducts } from '../../../redux/Product/Action';
import HomeSectionCard from '../HomeSectionList/HomeSectionCard';
import { 
    Box, 
    Container, 
    Typography,
    Tabs,
    Tab,
    Paper,
    Grid
} from '@mui/material';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const TopLevelProduct = () => {
    const { chuoi } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.product);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [thirdCategories, setThirdCategories] = useState([]);
    const [selectedThirdCategory, setSelectedThirdCategory] = useState('');
    const [allProducts, setAllProducts] = useState([]);

    const createRequestData = (thirdCategory = '') => ({
        colors: '',
        sizes: '',
        minPrice: 0,
        maxPrice: 100000000000,
        minDiscount: 0,
        topLevelCategory: chuoi,
        secondLevelCategory: '',
        thirdLevelCategory: thirdCategory,
        stock: '',
        sort: '',
        pageNumber: 1,
        pageSize: 1000
    });

    const fetchProducts = async (thirdCategory = '') => {
        try {
            const response = await dispatch(findProducts(createRequestData(thirdCategory)));
            if (response?.content) {
                if (thirdCategory) {
                    setFilteredProducts(response.content);
                } else {
                    setAllProducts(response.content);
                    setFilteredProducts(response.content);
                }
                return response.content;
            }
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        }
        return null;
    };

    useEffect(() => {
        const initializeData = async () => {
            if (chuoi) {
                const products = await fetchProducts();
                if (products) {
                    const uniqueCategories = [...new Set(
                        products.map(product => 
                            JSON.stringify({
                                name: product.category.thirdLevelCategory.name,
                                slug: product.category.thirdLevelCategory.slugCategory
                            })
                        )
                    )].map(categoryString => JSON.parse(categoryString));
                    
                    setThirdCategories(uniqueCategories);
                    
                    const categoryFromUrl = searchParams.get('category');
                    if (categoryFromUrl) {
                        const isValidCategory = uniqueCategories.some(
                            cat => cat.slug === categoryFromUrl
                        );
                        
                        if (isValidCategory) {
                            setSelectedThirdCategory(categoryFromUrl);
                            fetchProducts(categoryFromUrl);
                        } else {
                            setSearchParams({});
                            fetchProducts();
                        }
                    }
                }
            }
        };

        initializeData();
    }, [chuoi]);

    useEffect(() => {
        if (selectedThirdCategory) {
            fetchProducts(selectedThirdCategory);
            setSearchParams({ category: selectedThirdCategory });
        } else {
            setFilteredProducts(allProducts);
            setSearchParams({});
        }
    }, [selectedThirdCategory]);

    const handleTabChange = (event, newValue) => {
        const newCategory = newValue === 'all' ? '' : newValue;
        setSelectedThirdCategory(newCategory);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Container maxWidth="xl" className="py-8">
            <Paper 
                elevation={0} 
                sx={{ 
                    backgroundColor: 'transparent',
                    mb: 4
                }}
            >
                <Tabs 
                    value={selectedThirdCategory || 'all'}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#ee4d2d',
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            minWidth: 'auto',
                            padding: '12px 24px',
                            color: '#666',
                            '&.Mui-selected': {
                                color: '#ee4d2d',
                                fontWeight: 'bold'
                            },
                            '&:hover': {
                                color: '#ee4d2d',
                                opacity: 0.8
                            }
                        }
                    }}
                >
                    <Tab 
                        label="Tất cả" 
                        value="all"
                        sx={{
                            fontSize: '1rem'
                        }}
                    />
                    {thirdCategories.map((category, index) => (
                        <Tab
                            key={index}
                            label={category.name}
                            value={category.slug}
                            sx={{
                                fontSize: '1rem'
                            }}
                        />
                    ))}
                </Tabs>
            </Paper>

            {filteredProducts && filteredProducts.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                            <HomeSectionCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box className="text-center py-12">
                    <Typography variant="h6" color="text.secondary">
                        Không tìm thấy sản phẩm nào trong danh mục này
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default TopLevelProduct;