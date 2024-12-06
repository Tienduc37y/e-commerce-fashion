import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviewsAdmin, replyToReview, updateReplyReview, deleteReplyReview, findReviewByProduct } from '../../redux/Review/Action';
import { Rating, TextField, Button, Box, useTheme, IconButton, InputBase } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { tokens } from "../theme/theme";
import Header from '../components/Header';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from "../../hooks/useDebounce";

const ReviewFeedback = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const { adminReviews, loading } = useSelector(state => state.review);
    const [replyTexts, setReplyTexts] = useState({});
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchTerm = useDebounce(searchQuery, 1000);

    useEffect(() => {
        if (debouncedSearchTerm) {
            dispatch(findReviewByProduct(debouncedSearchTerm))
                .catch(error => {
                    toast.error('Lỗi khi tìm kiếm đánh giá: ' + error.message);
                });
        } else {
            dispatch(getAllReviewsAdmin());
        }
    }, [dispatch, debouncedSearchTerm]);

    const handleReplySubmit = async (reviewId) => {
        if (!replyTexts[reviewId]?.trim()) {
            toast.warning('Vui lòng nhập nội dung phản hồi');
            return;
        }

        try {
            await dispatch(replyToReview(reviewId, replyTexts[reviewId]));
            toast.success('Phản hồi đã được gửi thành công!');
            setReplyTexts(prev => ({...prev, [reviewId]: ''}));
        } catch (error) {
            toast.error('Lỗi khi gửi phản hồi: ' + error.message);
        }
    };

    const handleEditReply = (reviewId, currentReply) => {
        setEditingReplyId(reviewId);
        setReplyTexts(prev => ({...prev, [reviewId]: currentReply}));
    };

    const handleUpdateReply = async (reviewId) => {
        if (!replyTexts[reviewId]?.trim()) {
            toast.warning('Vui lòng nhập nội dung phản hồi');
            return;
        }

        try {
            await dispatch(updateReplyReview(reviewId, replyTexts[reviewId]));
            toast.success('Cập nhật phản hồi thành công!');
            setEditingReplyId(null);
        } catch (error) {
            toast.error('Lỗi khi cập nhật phản hồi: ' + error.message);
        }
    };

    const handleDeleteReply = async (reviewId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
            try {
                await dispatch(deleteReplyReview(reviewId));
                toast.success('Xóa phản hồi thành công!');
            } catch (error) {
                toast.error('Lỗi khi xóa phản hồi: ' + error.message);
            }
        }
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="ĐÁNH GIÁ" subtitle="Quản lý đánh giá sản phẩm" />
                
                <Box 
                    display="flex" 
                    backgroundColor={colors.primary[400]} 
                    borderRadius="3px"
                    height="45px"
                    width="300px"
                >
                    <InputBase
                        sx={{
                            ml: 2,
                            flex: 1,
                            color: colors.grey[100],
                            '&::placeholder': {
                                color: colors.grey[100],
                                opacity: 0.7
                            }
                        }}
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <IconButton type="button">
                        <SearchIcon sx={{ color: colors.grey[100] }} />
                    </IconButton>
                </Box>
            </Box>
            
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2" 
                         style={{ borderColor: colors.greenAccent[500] }}></div>
                </Box>
            ) : (
                <div className="space-y-4">
                    {adminReviews?.map((review) => (
                        <Box
                            key={review._id}
                            backgroundColor={colors.primary[400]}
                            p="20px"
                            borderRadius="8px"
                            sx={{
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                border: `1px solid ${colors.primary[500]}`
                            }}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p style={{ color: colors.greenAccent[500] }} className="font-semibold">
                                        {review.user?.name}
                                    </p>
                                    <p style={{ color: colors.grey[300] }} className="text-sm">
                                        {review.user?.email}
                                    </p>
                                </div>
                                <Rating 
                                    value={review.rating} 
                                    readOnly 
                                    sx={{
                                        color: colors.greenAccent[500],
                                        '& .MuiRating-iconFilled': {
                                            color: colors.greenAccent[500],
                                        },
                                    }}
                                />
                            </div>
                            
                            <div className="mt-4">
                                <p style={{ color: colors.grey[100] }} className="font-semibold">
                                    Sản phẩm: <span style={{ color: colors.greenAccent[500] }}>
                                        {review.product?.title}
                                    </span>
                                </p>
                                
                                {review.product?.image && (
                                    <div className="mt-2">
                                        <img 
                                            src={review.product.image}
                                            alt={review.product.title}
                                            className="w-24 h-24 object-cover rounded-lg"
                                            style={{ border: `1px solid ${colors.primary[500]}` }}
                                        />
                                    </div>
                                )}
                                
                                <p style={{ color: colors.grey[100] }} className="mt-2">{review.review}</p>
                                
                                {/* Hiển thị ảnh đánh giá */}
                                {review.imgUrl && review.imgUrl.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        {review.imgUrl.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img 
                                                    src={url}
                                                    alt={`review-${index}`}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                    style={{ border: `1px solid ${colors.primary[500]}` }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Phần phản hồi admin */}
                                {review.reply && (
                                    <Box
                                        mt={2}
                                        p={2}
                                        borderRadius="4px"
                                        sx={{
                                            backgroundColor: theme.palette.mode === 'dark' 
                                                ? colors.primary[500] 
                                                : '#fff',
                                            border: `1px solid ${theme.palette.mode === 'dark' 
                                                ? colors.primary[500] 
                                                : colors.grey[300]}`,
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <p style={{ 
                                                color: theme.palette.mode === 'dark' 
                                                    ? colors.greenAccent[500] 
                                                    : '#1a237e',
                                                fontWeight: 600 
                                            }}>
                                                Phản hồi Admin:
                                            </p>
                                            <div>
                                                <IconButton
                                                    onClick={() => handleEditReply(review._id, review.reply)}
                                                    size="small"
                                                    sx={{ 
                                                        color: theme.palette.mode === 'dark' 
                                                            ? colors.greenAccent[500] 
                                                            : colors.greenAccent[700]
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteReply(review._id)}
                                                    size="small"
                                                    sx={{ 
                                                        color: theme.palette.mode === 'dark' 
                                                            ? colors.redAccent[500] 
                                                            : colors.redAccent[700]
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                        <p style={{ 
                                            color: theme.palette.mode === 'dark' 
                                                ? colors.grey[100] 
                                                : '#1a237e',
                                            fontWeight: theme.palette.mode === 'dark' 
                                                ? 400 
                                                : 600
                                        }}>
                                            {review.reply}
                                        </p>
                                    </Box>
                                )}
                                
                                {/* Form phản hồi - Đã cập nhật màu sắc */}
                                {(!review.reply || editingReplyId === review._id) && (
                                    <Box mt={3}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Nhập phản hồi của bạn..."
                                            value={replyTexts[review._id] || ''}
                                            onChange={(e) => setReplyTexts(prev => ({
                                                ...prev,
                                                [review._id]: e.target.value
                                            }))}
                                            sx={{
                                                backgroundColor: theme.palette.mode === 'dark' 
                                                    ? colors.primary[500] 
                                                    : '#fff',
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: colors.greenAccent[500],
                                                    },
                                                },
                                            }}
                                        />
                                        <Box display="flex" justifyContent="flex-end" mt={2}>
                                            {editingReplyId === review._id ? (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleUpdateReply(review._id)}
                                                        sx={{
                                                            backgroundColor: colors.greenAccent[600],
                                                            marginRight: '8px',
                                                            '&:hover': {
                                                                backgroundColor: colors.greenAccent[700],
                                                            },
                                                        }}
                                                    >
                                                        Cập nhật
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => setEditingReplyId(null)}
                                                        sx={{
                                                            borderColor: colors.grey[500],
                                                            color: colors.grey[100],
                                                            '&:hover': {
                                                                borderColor: colors.grey[400],
                                                            },
                                                        }}
                                                    >
                                                        Hủy
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleReplySubmit(review._id)}
                                                    className="mt-2"
                                                    sx={{
                                                        backgroundColor: '#9155FD',
                                                        '&:hover': {
                                                            backgroundColor: '#804BDF',
                                                        },
                                                        marginTop: '8px'
                                                    }}
                                                >
                                                    Gửi phản hồi
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                            </div>
                        </Box>
                    ))}
                </div>
            )}
            
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Box>
    );
};

export default ReviewFeedback;