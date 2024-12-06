import { Grid, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { convertCurrency, convertDate } from '../../../common/convertCurrency';

const OrderCard = ({ order }) => {
    const navigate = useNavigate()
    
    return (
        <div onClick={() => navigate(`/account/order/${order?._id}`)} className='p-4 shadow-lg hover:shadow-2xl border cursor-pointer'>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div className='flex items-center mb-4'>
                        <img 
                            className='w-20 h-20 object-cover object-top mr-4' 
                            src={order?.orderItems[0]?.product?.variants[0]?.imageUrl} 
                            alt="" 
                        />
                        <div>
                            <Typography className='mb-2 font-semibold'>{order?._id}</Typography>
                            <Typography className='text-sm'>
                                Số lượng sản phẩm: {order?.orderItems?.length}
                            </Typography>
                        </div>
                    </div>
                </Grid>
                
                <Grid item xs={12}>
                    <Typography className='mb-2'>
                        Tổng tiền: {convertCurrency(order?.totalDiscountedPrice)}
                    </Typography>
                    {order?.promotion && 
                        <Typography className='mb-2'>
                            Voucher: {order?.promotion?.code}
                        </Typography>
                    }
                    <Typography className='mb-2'>
                        Hình thức thanh toán: {order?.paymentDetails?.paymentMethod}
                    </Typography>
                </Grid>
                
                <Grid item xs={12}>
                    <Typography className='mb-2'>
                        Ngày đặt hàng: {convertDate(order?.orderDate)}
                    </Typography>
                    <Typography className='text-sm font-semibold'>
                        Trạng thái: {order?.orderStatus}
                    </Typography>
                    {order?.completeOrderDate && (
                        <Typography className='text-sm'>
                            Ngày hoàn thành: {convertDate(order?.completeOrderDate)}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}

export default OrderCard
