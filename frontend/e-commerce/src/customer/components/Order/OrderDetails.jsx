import React from 'react'
import AddressCard from '../AddressCard/AddressCard'
import OrderTracker from './OrderTracker'
import { Box, Grid } from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
const OrderDetails = () => {
  return (
    <div className='px-5 lg:px-20'>
        <div>
          <h1 className='font-semibold text-xl py-7'> Địa chỉ giao hàng</h1>
          <AddressCard/>
        </div>
        <div className='py-20'>
          <OrderTracker activeStep={3}/>
        </div>
        <Grid container className='space-y-5 mb-10'>
          {[1,1,1,1,1,1].map((item,index) => (
            <Grid key={index} item container className='shadow-lg rounded-md p-5 border' sx={{alignItems:"center",justifyContent:"space-between"}}>
            <Grid item xs={6}>
              <div className='flex items-center space-x-5'>
                <img src="https://canifa.com/img/500/750/resize/5/t/5ts24s011-sw385-thumb.webp" alt="dfgd" className='w-[5rem] h-[5rem] object-cover object-top' />
                <div className='space-y-2 ml-5'>
                  <p className='font-semibold'>Áo này đẹp vcl</p>
                  <p className='space-x-5 opacity-50 text-xs font-semibold'>
                    <span>Màu sắc: Green</span>
                    <span>Size: M</span>
                  </p>
                  <p>500.000đ</p>
                </div>
              </div>
            </Grid>
            <Grid item> 
              <Box sx={{color:"green"}}>
                <StarIcon sx={{fontSize:"2rem"}} className='px-2'/>
                <span>Nhận xét và đánh giá</span>
              </Box>
            </Grid>
          </Grid>
          ))}
        </Grid>
    </div>
  )
}

export default OrderDetails