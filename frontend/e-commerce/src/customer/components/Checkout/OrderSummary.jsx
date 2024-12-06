import React from 'react';
import { Box, Typography, Divider, Button, Paper } from '@mui/material';
import { convertCurrency } from '../../../common/convertCurrency';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const OrderSummary = ({ orderTotal, discounte, total, promotionDiscount, promotionCode, onCheckout, isCheckoutDisabled }) => {
  return (
    <Paper elevation={3} sx={{ 
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText', 
        p: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Chi tiết đơn hàng
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>Giá trị đơn hàng</Typography>
          <Typography fontWeight="medium">{convertCurrency(orderTotal)}</Typography>
        </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Chiết khấu</Typography>
            <Typography color="green" fontWeight="medium">{convertCurrency(discounte)}</Typography>
          </Box>
        {promotionCode && promotionDiscount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Mã giảm giá ({promotionCode})</Typography>
            <Typography color="green" fontWeight="medium">{convertCurrency(promotionDiscount)}</Typography>
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">Tổng tiền thanh toán</Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
            {convertCurrency(total)}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="error" 
          fullWidth 
          size="large"
          onClick={onCheckout}
          disabled={isCheckoutDisabled}
          sx={{ 
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: 'error.dark',
            }
          }}
        >
          Thanh toán
        </Button>
      </Box>
    </Paper>
  );
};

export default OrderSummary;
