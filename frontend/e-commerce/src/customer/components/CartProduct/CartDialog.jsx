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
    if (newQuantity >= 1) {
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
          width: '25%',
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
      <DialogTitle sx={{ m: 0, p: 2 }}>
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
      <DialogContent dividers sx={{ p: 2, overflowY: 'auto' }}>
        <List>
          {cart?.cart?.cartItems?.map((item) => (
            <ListItem key={item?._id} sx={{ py: 2, borderBottom: '1px solid #eee', flexDirection: 'column', alignItems: 'stretch' }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box 
                  component="img"
                  src={item?.product?.variants?.find(v => v?.color === item?.color)?.imageUrl}
                  alt={item?.product?.title}
                  sx={{ 
                    width: 80, 
                    height: 120, 
                    objectFit: 'cover',
                    mr: 2 
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{fontSize: 18, fontWeight: 'bold'}}>{item?.product?.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box 
                      sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        backgroundColor: item?.color, 
                        mr: 1, 
                        border: '1px solid #ccc' 
                      }} 
                    />
                    <Typography variant="body2">{item?.product?.variants?.find(v => v?.color === item?.color)?.nameColor}</Typography>
                    <Typography variant="body2" sx={{ ml: 2 }}>Size: {item?.size}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{mt: 1 }}> 
                    <span className='line-through mr-2'>{convertCurrency(item?.price)}</span>
                    <span className='text-red-500 font-bold'>- {item?.discountedPersent}%</span>
                    </Typography>
                  <Typography sx={{fontWeight:'bold'}} variant="body1">{convertCurrency(item?.discountedPrice)}</Typography>
                </Box>
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item?._id)} sx={{ alignSelf: 'flex-start' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 4 }}>
                  <IconButton size="small" onClick={() => handleUpdateQuantity(item, item?.quantity - 1)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 2 }}>{item?.quantity}</Typography>
                  <IconButton size="small" onClick={() => handleUpdateQuantity(item, item?.quantity + 1)}>
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
          <span>-{convertCurrency(cart?.cart?.discounte || 0)}</span>
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
