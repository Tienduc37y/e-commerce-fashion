import React from 'react'
import { Grid } from '@mui/material'
import { convertDate } from '../../../common/convertCurrency'

const AddressCard = ({order}) => {
  return (
    <Grid container spacing={{xs: 2, md: 4}} className='p-4'>
      {/* Cột bên trái - Địa chỉ và SĐT */}
      <Grid item xs={12} md={6}>
        <div className='space-y-3'>
          <p className='font-semibold text-lg'>Địa chỉ</p>
          <span className='text-gray-900 text-base md:text-lg line-clamp-2'>
            {order?.shippingAddress?.address.streetAddress + ", " + 
             order?.shippingAddress?.address.ward + ", " + 
             order?.shippingAddress?.address.district + ", " + 
             order?.shippingAddress?.address.city}
          </span>
          
          <div className='space-y-1 mt-4'>
            <p className='font-semibold text-lg'>SĐT</p>
            <span className='text-gray-900 text-base md:text-lg'>
              {order?.shippingAddress?.address?.mobile}
            </span>
          </div>
        </div>
      </Grid>

      {/* Cột bên phải - Phương thức thanh toán và ngày đặt */}
      <Grid item xs={12} md={6}>
        <div className='space-y-3'>
          <div className='space-y-1'>
            <p className='font-semibold text-lg'>Phương thức thanh toán</p>
            <span className='text-gray-900 text-base md:text-lg'>
              {order?.paymentDetails?.paymentMethod}
            </span>
          </div>

          <div className='space-y-1 mt-4'>
            <p className='font-semibold text-lg'>Ngày đặt hàng</p>
            <span className='text-gray-900 text-base md:text-lg'>
              {convertDate(order?.orderDate)}
            </span>
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default AddressCard