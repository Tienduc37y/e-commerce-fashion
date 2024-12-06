import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Grid, Box, Typography, Container, Paper } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressForm from '../../components/Checkout/ShippingAddressForm';
import PaymentMethod from '../../components/Checkout/PaymentMethod';
import CartItem from '../../components/CartProduct/CartItem';
import OrderSummary from '../../components/Checkout/OrderSummary';
import PromotionCode from '../../components/Checkout/PromotionCode';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../../../redux/Order/Action';
import { getCart } from '../../../redux/Cart/Action';
import axiosInstance from '../../../axios/api';

const OrderInfo = () => {
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    district: '',
    ward: '',
    mobile: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const { cart, auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appliedPromotion, setAppliedPromotion] = useState(null);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleShippingInfoChange = useCallback((info) => {
    setShippingInfo(info);
  }, []);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const isShippingInfoComplete = useMemo(() => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.streetAddress &&
      shippingInfo.city &&
      shippingInfo.district &&
      shippingInfo.ward &&
      shippingInfo.mobile
    );
  }, [shippingInfo]);

  const isCartEmpty = useMemo(() => {
    return !cart?.cart?.cartItems || cart.cart.cartItems.length === 0;
  }, [cart]);

  const handleCheckout = async () => {
    if (isCartEmpty) {
      toast.error('Vui lòng thêm sản phẩm vào giỏ hàng');
    } else if (!isShippingInfoComplete) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
    } else {
      const orderData = {
        shippingAddress: shippingInfo,
        paymentMethod: paymentMethod,
        code: cart?.cart?.promotion?.code || ''
      };
      try {
        const response = await dispatch(createOrder(orderData));
        if (response && response.order) {
          if (paymentMethod === 'COD') {
            navigate(`/account/order/`);
          } else if (paymentMethod === 'ZALOPAY') {
            try {
              const zaloPayResponse = await axiosInstance.post(`/api/payment/create-zalopay-order/${response.order._id}`);
              if (zaloPayResponse.data && zaloPayResponse.data.order_url) {
                window.location.href = zaloPayResponse.data.order_url;
              } else {
                toast.error('Không thể tạo đơn hàng ZaloPay. Vui lòng thử lại.');
              }
            } catch (zaloPayError) {
              console.error('ZaloPay error:', zaloPayError);
              toast.error('Có lỗi xảy ra khi tạo đơn hàng ZaloPay. Vui lòng thử lại.');
            }
          }
        } else {
          toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        }
      } catch (error) {
        toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      }
    }
  };

  const handleApplyPromotion = () => {
    dispatch(getCart());
  };

  const handleRemovePromotion = () => {
    dispatch(getCart());
  };

  return (
    <>
      <header className='text-right text-2xl mt-3 mr-10 font-bold text-blue-500'>
        <Link to="/">Tiếp tục mua sắm</Link>
      </header>
      <Container className='px-2 lg:px-15 py-10' maxWidth="xl">
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
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Box sx={{ mt: 4, width: '100%' }}>
              <ShippingAddressForm 
                onShippingInfoChange={handleShippingInfoChange}
                initialAddress={auth?.user?.address}
              />
            </Box>
            <Box sx={{ mt: 4, width: '100%' }}>
              <PaymentMethod onPaymentMethodChange={handlePaymentMethodChange} />
            </Box>
            <Paper elevation={3} sx={{ 
              mt: 4, 
              borderRadius: 2,
              p: 3,
              width: '100%'
            }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShoppingBagIcon sx={{ mr: 1 }} />
                Sản phẩm trong giỏ hàng
              </Typography>
              {isCartEmpty ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 4
                }}>
                  <RemoveShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Không có sản phẩm trong giỏ hàng
                  </Typography>
                </Box>
              ) : (
                cart?.cart?.cartItems?.map((item, index) => (
                  <CartItem key={index} cartItem={item} />
                ))
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Box sx={{ mt: 4 }}>
              <PromotionCode promotion={cart?.cart?.promotion} onApplyPromotion={handleApplyPromotion} onRemovePromotion={handleRemovePromotion} />
              <OrderSummary 
                orderTotal={cart?.cart?.totalPrice}
                discounte={cart?.cart?.discounte}
                total={cart?.cart?.totalDiscountedPrice}
                promotionDiscount={cart?.cart?.discountCode || 0}
                promotionCode={cart?.cart?.promotion?.code}
                onCheckout={handleCheckout}
                isCheckoutDisabled={!isShippingInfoComplete || isCartEmpty}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default OrderInfo;
