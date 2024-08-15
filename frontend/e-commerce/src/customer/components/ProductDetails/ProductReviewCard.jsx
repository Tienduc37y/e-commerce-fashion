import { Avatar, Box, Grid, Rating } from '@mui/material'
import React from 'react'

const ProductReviewCard = () => {
  return (
    <div>
        <Grid container spacing={2} gap={3}>
            <Grid item xs={1}>
                <Box>
                    <Avatar className='text-white' sx={{width:40,height:40,bgcolor:"#9155fd"}}>R</Avatar>
                </Box>
            </Grid>
            <Grid item xs={9}>
                <div className='space-y-2'>
                    <div>
                        <p className='font-semibold text-lg'>Đức</p>
                        <p className='opacity-70'>15/08/2024</p>
                    </div>
                </div>

                <Rating value={4.5} name='đánh giá' readOnly precision={.5}/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, mollitia quasi corrupti alias sunt fugit tempore repudiandae? Inventore tempora cupiditate velit, accusamus, nesciunt doloribus laboriosam aliquam vitae delectus doloremque ipsum!</p>
            </Grid>
        </Grid>
    </div>
  )
}

export default ProductReviewCard