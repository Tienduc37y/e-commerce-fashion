import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Typography, Box, TextField, Button, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import { applyPromotion, removePromotion } from '../../../redux/Promotion/Action';

const PromotionCode = ({ promotion, onApplyPromotion, onRemovePromotion }) => {
  const [promotionCode, setPromotionCode] = useState(promotion?.code);
  const dispatch = useDispatch();
  const handleApplyPromotion = async () => {
    if (!promotionCode) {
      toast.error('Vui lòng nhập mã khuyến mãi');
      return;
    }

    try {
      await dispatch(applyPromotion(promotionCode));
      toast.success('Áp dụng mã khuyến mãi thành công');
      setPromotionCode('');
      onApplyPromotion();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi áp dụng mã khuyến mãi');
    }
  };

  const handleRemovePromotion = async () => {
    try {
      await dispatch(removePromotion(promotion?.code));
      toast.info('Đã xóa mã khuyến mãi');
      onRemovePromotion(); // Callback to parent to update cart
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa mã khuyến mãi');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Mã khuyến mãi
      </Typography>
      {!promotion ? (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={promotionCode}
            onChange={(e) => setPromotionCode(e.target.value)}
            placeholder="Nhập mã khuyến mãi"
            sx={{ mr: 1 }}
          />
          <Button variant="contained" onClick={handleApplyPromotion}>
            Áp dụng
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Chip
            label={`${promotion.code}`}
            onDelete={handleRemovePromotion}
            color="primary"
          />
          <Typography variant="body2" color="success.main">
            Đã áp dụng mã giảm giá
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PromotionCode;
