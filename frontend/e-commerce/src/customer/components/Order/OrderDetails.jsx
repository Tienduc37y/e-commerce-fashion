import React from 'react'
import AddressCard from '../AddressCard/AddressCard'
import OrderTracker from './OrderTracker'
import { Box, Grid, Button } from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getOrderById } from '../../../redux/Order/Action'
import { useParams, useNavigate } from 'react-router-dom'
import { convertCurrency } from '../../../common/convertCurrency';
import { toast } from 'react-toastify';
import axiosInstance from '../../../axios/api';
import { addItemToCart } from '../../../redux/Cart/Action';
import { getCart } from '../../../redux/Cart/Action';

const OrderDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const order = useSelector(state => state.order)

  useEffect(() => {
    dispatch(getOrderById(params?.orderId))
  }, [dispatch, params?.orderId])

  const handleReviewClick = (productId) => {
    navigate(`/review/${productId}`);
  };

  const handleRefundOrder = async () => {
    try {
      const response = await axiosInstance.put(`/api/admin/orders/${params?.orderId}/refund`);
      if (response.data.status === "200") {
        toast.success(response.data.message);
        // Cập nhật lại thông tin đơn hàng
        dispatch(getOrderById(params?.orderId));
      }
    } catch (error) {
      console.error("Lỗi khi yêu cầu hoàn trả:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi yêu cầu hoàn trả");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axiosInstance.put(`/api/admin/orders/${params?.orderId}/cancel`);
      if (response.data.status === "200") {
        toast.success(response.data.message);
        // Cập nhật lại thông tin đơn hàng
        dispatch(getOrderById(params?.orderId));
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  const handleReorder = async () => {
    try {
      // Thêm từng sản phẩm vào giỏ hàng
      for (const item of order?.order?.orderItems) {
        await dispatch(addItemToCart({
          productId: item?.product?._id,
          size: item?.size,
          color: item?.color,
          quantity: item?.quantity
        }));
      }
      
      // Cập nhật lại giỏ hàng
      dispatch(getCart());
      
      toast.success('Đã thêm tất cả sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    }
  };

  return (
    <div className='px-4 lg:px-20'>
        <div>
          <div className='flex justify-between items-center'>
            <h1 className='font-semibold text-xl py-5 md:py-7'>Địa chỉ giao hàng</h1>
            <Button
              variant="contained"
              onClick={handleReorder}
              sx={{
                backgroundColor: '#9155FD',
                '&:hover': {
                  backgroundColor: '#804BDF'
                }
              }}
            >
              Mua lại
            </Button>
          </div>
          <AddressCard order={order?.order}/>
        </div>
        
        <div className='py-10 md:py-15'>
          <OrderTracker 
            activeStep={order?.order?.orderStatus} 
            paymentMethod={order?.order?.paymentDetails?.paymentMethod}
            onCancelOrder={handleCancelOrder}
          />
        </div>

        {(order?.order?.orderStatus === "Đặt hàng thành công" || 
          order?.order?.orderStatus === "Đang chờ xử lý") && (
          <div className='py-5 flex justify-end'>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelOrder}
              sx={{
                marginRight: '1rem'
              }}
            >
              Hủy đơn hàng
            </Button>
          </div>
        )}

        {order?.order?.orderStatus === "Đã hoàn thành" && (
          <div className='py-5 flex justify-end'>
            <Button
              variant="contained"
              onClick={handleRefundOrder}
              sx={{
                backgroundColor: '#9155FD',
                '&:hover': {
                  backgroundColor: '#804BDF'
                }
              }}
            >
              Yêu cầu hoàn trả
            </Button>
          </div>
        )}

        {/* Grid tổng quan */}
        <Grid container className='mb-6 shadow-lg rounded-md p-4 md:p-5 border'>
          <Grid item xs={12} sm={4} className='mb-4 sm:mb-0'>
            <div className='flex flex-col items-center sm:items-start'>
              <span className='text-gray-500 text-sm'>Số lượng sản phẩm</span>
              <span className='font-semibold text-xl md:text-2xl mt-1'>
                {order?.order?.totalItem} sản phẩm
              </span>
            </div>
          </Grid>
          
          <Grid item xs={12} sm={4} className='mb-4 sm:mb-0'>
            <div className='flex flex-col items-center'>
              <span className='text-gray-500 text-sm'>Mã giảm giá</span>
              <div className='flex flex-col items-center'>
                <span className='font-semibold text-xl md:text-2xl mt-1'>
                  {order?.order?.promotion?.code || "Không có"}
                </span>
              </div>
            </div>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <div className='flex flex-col items-center sm:items-end'>
              <span className='text-gray-500 text-sm'>Tổng tiền</span>
              {order?.order?.promotion && (
                <span className='text-gray-500 line-through text-sm md:text-base'>
                  {convertCurrency(order?.order?.totalPrice)}
                </span>
              )}
              <span className='font-semibold text-xl md:text-2xl text-[#9155FD]'>
                {convertCurrency(order?.order?.totalDiscountedPrice)}
              </span>
            </div>
          </Grid>
        </Grid>

        {/* Danh sách sản phẩm */}
        <Grid container className='space-y-4 md:space-y-5 mb-10'>
          {order?.order?.orderItems?.map((item,index) => (
            <Grid key={index} item container className='shadow-lg rounded-md p-4 md:p-5 border' 
              sx={{alignItems:"center", justifyContent:"space-between"}}>
              <Grid item xs={12} sm={6} className='mb-4 sm:mb-0'>
                <div className='flex items-center space-x-3 md:space-x-5'>
                  <div 
                    className='relative cursor-pointer hover:opacity-80 transition-opacity duration-200'
                    onClick={() => navigate(`/product/${item?.product?.slugProduct}/${item?.product?._id}`)}
                  >
                    <img 
                      src={item?.product?.variants[0]?.imageUrl} 
                      alt={item?.product?.variants[0]?.slugColor} 
                      className='w-[4rem] h-[4rem] md:w-[5rem] md:h-[5rem] object-cover object-top rounded-md' 
                    />
                    <div className='absolute -top-2 -right-2 bg-[#9155FD] text-white rounded-full min-w-[1.25rem] h-5 md:min-w-[1.5rem] md:h-6 flex items-center justify-center text-xs md:text-sm font-medium px-1'>
                      {item?.quantity}
                    </div>
                  </div>

                  <div 
                    className='space-y-1 md:space-y-2 flex-grow cursor-pointer hover:opacity-80 transition-opacity duration-200'
                    onClick={() => navigate(`/product/${item?.product?.slugProduct}/${item?.product?._id}`)}
                  >
                    <p className='font-semibold text-sm md:text-base'>{item?.product?.title}</p>
                    <div className='flex items-center space-x-3 md:space-x-5 text-xs font-semibold text-gray-500'>
                      <div className='flex items-center space-x-1.5'>
                        <span>Màu sắc:</span>
                        <div 
                          className='w-4 h-4 rounded-full border border-gray-300'
                          style={{
                            backgroundColor: item?.color?.toLowerCase(),
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                          }}
                          title={item?.color}
                        />
                      </div>
                      <span>Size: {item?.size}</span>
                    </div>
                    
                    {/* Phần giá được cập nhật */}
                    <div className='flex flex-col md:flex-row md:items-center md:space-x-4'>
                      {item?.product?.discountedPersent > 0 ? (
                        // Có giảm giá
                        <div className='flex items-center space-x-2'>
                          <span className='text-sm md:text-base font-semibold text-[#9155FD]'>
                            {convertCurrency(item?.product?.discountedPrice)}
                          </span>
                          <span className='text-xs md:text-sm text-gray-500 line-through'>
                            {convertCurrency(item?.product?.price)}
                          </span>
                          <span className='text-xs md:text-sm text-red-500 font-bold'>
                            -{item?.product?.discountedPersent}%
                          </span>
                        </div>
                      ) : (
                        // Không giảm giá
                        <span className='text-sm md:text-base font-semibold text-[#9155FD]'>
                          {convertCurrency(item?.product?.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} className='flex justify-center sm:justify-end'> 
                {order?.order?.orderStatus === "Đã giao hàng" || 
                  order?.order?.orderStatus === "Đã thanh toán" ||
                  order?.order?.orderStatus === "Đã hoàn thành" ||
                  order?.order?.orderStatus === "Hoàn trả hàng" ? (
                  <Box 
                    sx={{color:"green"}} 
                    className='flex items-center cursor-pointer hover:opacity-80'
                    onClick={() => handleReviewClick(item?.product?._id)}
                  >
                    <StarIcon sx={{fontSize:{xs: "1.5rem", md: "2rem"}}} className='px-2'/>
                    <span className='text-sm md:text-base'>Nhận xét và đánh giá</span>
                  </Box>
                ) : (
                  <Box 
                    sx={{color:"gray"}} 
                    className='flex items-center opacity-50'
                  >
                    <StarIcon sx={{fontSize:{xs: "1.5rem", md: "2rem"}}} className='px-2'/>
                    <span className='text-sm md:text-base'>Đánh giá sản phẩm</span>
                  </Box>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>

    </div>
  )
}

export default OrderDetails