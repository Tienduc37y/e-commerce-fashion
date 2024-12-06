import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  List, 
  ListItem, 
  Typography, 
  IconButton,
  Box,
  Slide
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { updateCartItem, removeCartItem } from '../../../redux/Cart/Action';
import { convertCurrency } from '../../../common/convertCurrency';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const CartDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const cart = useSelector(store => store.cart)

  const handleUpdateQuantity = (item, newQuantity) => {
    const variant = item?.product?.variants?.find(v => v?.color === item?.color);
    const sizeInfo = variant?.sizes?.find(s => s?.size === item?.size);
    
    const maxQuantity = sizeInfo?.quantityItem || 0;

    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      dispatch(updateCartItem({ cartItemId: item._id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeCartItem(itemId));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '80%', md: '50%', lg: '25%' },
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          m: 0,
          position: 'fixed',
          top: 0,
          right: 0,
          borderRadius: 0,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: { xs: 1.5, sm: 2 }, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Giỏ hàng ({cart?.cart?.cartItems?.length || 0})
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: { xs: 1, sm: 2 }, overflowY: 'auto' }}>
        <List>
          {cart?.cart?.cartItems?.map((item) => (
            <ListItem key={item?._id} sx={{ 
              py: { xs: 1.5, sm: 2 }, 
              px: { xs: 1, sm: 2 },
              borderBottom: '1px solid #eee', 
              flexDirection: 'column', 
              alignItems: 'stretch' 
            }}>
              <Box sx={{ display: 'flex', mb: { xs: 1, sm: 2 } }}>
                <Box 
                  component="img"
                  src={item?.product?.variants?.find(v => v?.color === item?.color)?.imageUrl}
                  alt={item?.product?.title}
                  sx={{ 
                    width: { xs: 60, sm: 80 }, 
                    height: { xs: 90, sm: 120 }, 
                    objectFit: 'cover',
                    mr: { xs: 1, sm: 2 }
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{
                    fontSize: { xs: 14, sm: 16, md: 18 }, 
                    fontWeight: 'bold',
                    lineHeight: 1.2,
                    mb: 0.5
                  }}>
                    {item?.product?.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Box 
                      sx={{ 
                        width: { xs: 16, sm: 20 }, 
                        height: { xs: 16, sm: 20 }, 
                        borderRadius: '50%', 
                        backgroundColor: item?.color, 
                        mr: 1, 
                        border: '1px solid #ccc' 
                      }} 
                    />
                    <Typography variant="body2" sx={{ fontSize: { xs: 12, sm: 14 } }}>
                      {item?.product?.variants?.find(v => v?.color === item?.color)?.nameColor}
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 2, fontSize: { xs: 12, sm: 14 } }}>
                      Size: {item?.size}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: { xs: 12, sm: 14 } }}> 
                    <span className='line-through mr-2'>{convertCurrency(item?.price)}</span>
                    <span className='text-red-500 font-bold'>- {item?.discountedPersent}%</span>
                  </Typography>
                  <Typography sx={{
                    fontWeight:'bold',
                    fontSize: { xs: 14, sm: 16 }
                  }}>
                    {convertCurrency(item?.discountedPrice)}
                  </Typography>
                </Box>
                <IconButton 
                  edge="end" 
                  aria-label="delete" 
                  onClick={() => handleRemoveItem(item?._id)} 
                  sx={{ 
                    alignSelf: 'flex-start',
                    p: { xs: 0.5, sm: 0.75 }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 4 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleUpdateQuantity(item, item?.quantity - 1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 2 }}>{item?.quantity}</Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleUpdateQuantity(item, item?.quantity + 1)}
                    disabled={item?.quantity >= (
                      item?.product?.variants
                        ?.find(v => v?.color === item?.color)
                        ?.sizes?.find(s => s?.size === item?.size)
                        ?.quantityItem || 0
                    )}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {convertCurrency(item?.discountedPrice)}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <span>Tạm tính:</span>
          <span>{convertCurrency(cart?.cart?.totalPrice || 0)}</span>
        </Typography>
        <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'green' }}>
          <span>Tiết kiệm:</span>
          <span>{convertCurrency(cart?.cart?.discounte)}</span>
        </Typography>
        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontWeight: 'bold' }}>
          <span>Tổng cộng:</span>
          <span>{convertCurrency(cart?.cart?.totalDiscountedPrice || 0)}</span>
        </Typography>
        <Button 
          onClick={() => {navigate('/checkout')}} 
          fullWidth 
          variant="contained" 
          sx={{ 
            backgroundColor: 'red', 
            color: 'white', 
            '&:hover': {
              backgroundColor: 'darkred',
            }
          }}
        >
          Đặt hàng
        </Button>
      </Box>
    </Dialog>
  );
};

export default CartDialog;
