import { Grid } from '@mui/material'
import React from 'react'
import AdjustIcon from '@mui/icons-material/Adjust';
import { useNavigate } from 'react-router-dom';

const OrderCard = () => {
    const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/account/order/${5}`)} className='p-5 shadow-lg hover:shadow-2xl border cursor-pointer'>
        <Grid container spacing={1} sx={{justifyContent:"space-between"}}>
            <Grid item xs={6}>
                <div className='flex cursor-pointer'>
                    <img className='w-[5rem] h-[5rem] object-cover object-top' src="https://canifa.com/img/500/750/resize/6/t/6ts24s020-fw276-thumb.webp" alt="" />
                    <div className='ml-5 space-y-2'>
                        <p className='mb-2'>Áo sơ mi đẹp v</p>
                        <p className='opacity-50 text-sm font-semibold'>Size: M</p>
                        <p className='opacity-50 text-sm font-semibold'>Màu sắc: Black</p>
                    </div>
                </div>
            </Grid>
            <Grid xs={2}>
                <p>200.000đ</p>
            </Grid>
            <Grid xs={4}>
                {true ? <div>
                    <p>
                    <AdjustIcon sx={{width:"15px",height:"15px"}} className='text-green-600 mr-2'/>
                    <span>Đã chuyển vào ngày 12 tháng 8 năm 2024</span>
                </p>
                    <span className='text-sm'>Đơn hàng đã được giao</span>
                </div> : ""}
                {false ? <p>
                    <span>Thời gian giao dự kiến vào ngày 12 tháng 8 năm 2024</span>
                </p> : ""}
            </Grid>
        </Grid>
    </div>
  )
}

export default OrderCard