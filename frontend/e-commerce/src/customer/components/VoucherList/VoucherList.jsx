import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getPromotions } from '../../../redux/Promotion/Action';
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../HomeSectionList/HomeSectionList.css';
import './VoucherList.css';
const VoucherList = () => {
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [copiedCodes, setCopiedCodes] = useState({});
    
    // Lấy promotions từ Redux store
    const { promotions, loading, error } = useSelector((state) => state.promotion);

    useEffect(() => {
        dispatch(getPromotions(1, 100));
    }, [dispatch]);

    // Lọc chỉ lấy những promotion có visible = true
    const visiblePromotions = promotions?.promotions?.filter(promo => promo.visible);

    const handleOpenDialog = (voucher) => {
        setSelectedVoucher(voucher);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCopyCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCodes(prev => ({
                ...prev,
                [code]: true
            }));
            
            setTimeout(() => {
                setCopiedCodes(prev => ({
                    ...prev,
                    [code]: false
                }));
            }, 2000);
        } catch (error) {
            console.error('Không thể copy mã:', error);
        }
    };

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Cấu hình cho Slider
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>Có lỗi xảy ra: {error}</div>;

    return (
        <Box className="container mx-auto px-2 sm:px-6 overflow-hidden">
                <div className="section-title-container px-2 sm:px-0">
                    <Typography 
                        variant="h4" 
                        className="section-title text-lg sm:text-xl md:text-2xl"
                    >
                        Ưu đãi nổi bật
                    </Typography>
                    <div className="title-underline"></div>
                </div>

            <Box className="voucher-slider py-4 sm:py-8 md:px-0 px-0 sm:px-4">
                <Slider {...settings}>
                    {visiblePromotions.map((promotion) => (
                        <Box key={promotion._id} className="px-1 sm:px-2">
                            <Box className="border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row 
                                justify-between gap-3 sm:gap-4 bg-white shadow-sm hover:shadow-md transition-all duration-200 h-full"
                            >
                                <Box className="space-y-2 flex-1">
                                    <Typography className="font-bold text-base sm:text-lg text-[#ee4d2d]">
                                        Giảm {promotion.discountPercentage}%
                                    </Typography>
                                    <Typography className="text-xs sm:text-sm text-gray-600 break-words">
                                        Đơn tối thiểu {formatCurrency(promotion.minOrderValue)}
                                    </Typography>
                                    <Typography className="text-xs text-gray-500 flex items-center gap-1">
                                        <span>HSD:</span> {formatDate(promotion.endDate)}
                                    </Typography>
                                    <button
                                        onClick={() => handleOpenDialog(promotion)}
                                        className="text-[#ee4d2d] text-xs hover:underline mt-1 font-medium"
                                    >
                                        Xem điều kiện
                                    </button>
                                </Box>

                                <Box className="flex items-center justify-center sm:flex sm:items-center">
                                    <button
                                        onClick={() => handleCopyCode(promotion.code)}
                                        className={`px-4 py-2 rounded-lg text-white text-sm font-medium
                                            min-w-[90px] sm:min-w-[100px] transition-all duration-200 ${
                                            copiedCodes[promotion.code]
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : 'bg-[#ee4d2d] hover:bg-[#d73211]'
                                        }`}
                                        disabled={copiedCodes[promotion.code]}
                                    >
                                        {copiedCodes[promotion.code] ? 'Đã lưu' : 'Lưu mã'}
                                    </button>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Slider>
            </Box>

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        width: '90%',
                        maxWidth: '500px',
                        margin: '16px'
                    }
                }}
            >
                <DialogTitle 
                    className="flex items-center justify-between py-3 px-4 border-b"
                    sx={{
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    <Typography 
                        className="text-base sm:text-lg font-medium text-gray-800"
                    >
                        Chi tiết ưu đãi
                    </Typography>
                    <IconButton
                        onClick={handleCloseDialog}
                        size="small"
                        sx={{
                            color: '#666',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.04)'
                            }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="p-4">
                    {selectedVoucher && (
                        <Box className="space-y-4">
                            {/* Phần mã giảm giá */}
                            <Box className="bg-gray-50 p-3 rounded-lg">
                                <Typography className="font-medium text-gray-800 mb-1">
                                    Mã: <span className="text-[#ee4d2d]">{selectedVoucher.code}</span>
                                </Typography>
                                <Typography className="text-sm text-gray-600">
                                    {selectedVoucher.description}
                                </Typography>
                            </Box>

                            {/* Phần điều kiện */}
                            <Box className="space-y-3">
                                <Typography className="font-medium text-gray-800">
                                    Điều kiện sử dụng:
                                </Typography>
                                <Box className="space-y-2 text-sm text-gray-600">
                                    <Box className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <Typography>
                                            Giảm {selectedVoucher.discountPercentage}% cho đơn hàng từ {formatCurrency(selectedVoucher.minOrderValue)}
                                        </Typography>
                                    </Box>
                                    <Box className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <Typography>
                                            Có hiệu lực đến: {formatDate(selectedVoucher.endDate)}
                                        </Typography>
                                    </Box>
                                    <Box className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <Typography>
                                            Không áp dụng cùng các chương trình khuyến mãi khác
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Nút copy mã */}
                            <Box className="pt-2">
                                <button
                                    onClick={() => handleCopyCode(selectedVoucher.code)}
                                    className={`w-full py-2.5 rounded-lg transition-all duration-200 text-white font-medium ${
                                        copiedCodes[selectedVoucher.code]
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-[#ee4d2d] hover:bg-[#d73211]'
                                    }`}
                                >
                                    {copiedCodes[selectedVoucher.code] ? 'Đã sao chép mã' : 'Sao chép mã'}
                                </button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default VoucherList; 