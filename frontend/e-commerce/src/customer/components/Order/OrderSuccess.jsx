import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Typography, Box, Container, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getOrderById } from '../../../redux/Order/Action';
import { useDispatch, useSelector } from 'react-redux';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const order = useSelector(store => store.order);

  // Phân tích query parameters
  const queryParams = new URLSearchParams(location.search);
  const queryObject = Object.fromEntries(queryParams.entries());

  useEffect(() => {
    dispatch(getOrderById(params.orderId));
  }, [params.orderId, dispatch]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Đặt hàng thành công!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          {params.orderId}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Chúng tôi sẽ xác nhận đơn hàng và thông tin vận chuyển cho bạn sớm nhất.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Trạng Thái Thanh Toán: {order.order?.createdOrder?.orderStatus === "Pending" ? "Chưa Thanh Toán" : "Đã Thanh Toán"}
        </Typography>
        {/* Hiển thị thông tin query parameters */}
        <Typography variant="body2" sx={{ mb: 4 }}>
          Thông tin query: {JSON.stringify(queryObject)}
        </Typography>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Tiếp tục mua sắm
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(`/account/order/${params.orderId}`)}
          >
            Xem chi tiết đơn hàng
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess;
