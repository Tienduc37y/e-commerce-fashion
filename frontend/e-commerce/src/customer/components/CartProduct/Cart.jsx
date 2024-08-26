import React from 'react'
import CartItem from './CartItem'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
const Cart = () => {
  const navigate = useNavigate()
  const handleCheckout = () => {
    navigate("/checkout?step=2")
  }
  return (
    <div>
      <div className='lg:grid grid-cols-3 lg:px-16 relative mt-10'>
        <div className='col-span-2 space-y-6'>
          {
            [1,1,1,1].map((item,index) => <CartItem key={index}/>)
          }
        </div>
      <div className='px-5 sticky top-0 h-[100vh] lg:mt-0'>
        <div className='border'>
          <p className='uppercase font-bold opacity-60 p-4'>Chi tiết thanh toán</p>
          <hr />
          <div className='space-y-3 font-semibold p-3'>
            <div className='flex justify-between pt-3 text-black'>
              <span>Giá</span>
              <span>20.000.000đ</span>
            </div>
            <div className='flex justify-between pt-3 '>
              <span>Disccount</span>
              <span className='text-green-600'>20.000.000đ</span>
            </div>
            <div className='flex justify-between pt-3 '>
              <span>Phí Ship</span>
              <span className='text-green-600'>20.000.000đ</span>
            </div>
            <div className='flex justify-between pt-3 font-bold'>
              <span>Tổng cộng</span>
              <span className='text-green-600'>20.000.000đ</span>
            </div>
          </div>
        </div>
          <Button onClick={handleCheckout} className='w-full' variant='contained' sx={{px:"2.5rem",mt:".7rem",py:"1rem"}}>
                Thanh toán
          </Button>
      </div>
      </div>
    </div>
  )
}

export default Cart