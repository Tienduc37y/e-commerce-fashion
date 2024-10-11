import React from 'react'
import CartItem from './CartItem'
import { Button} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCart } from '../../../redux/Cart/Action'
import { useEffect, useState } from 'react'
import { convertCurrency } from '../../../common/convertCurrency'
import { ToastContainer } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {cart} = useSelector(store => store)
  useEffect(() => {
    dispatch(getCart())
  },[cart.updatedCartItem,cart.deletedCartItem])
  const handleCheckout = () => {
    navigate("/checkout?step=2")
  }
  return (
    <div>
      <div className='lg:grid grid-cols-3 lg:px-16 relative mt-10'>
        <div className='col-span-2 space-y-6'>
          {
            cart?.cartItems?.map((item,index) => <CartItem key={index} cartItem={item}/>)
          }
        </div>
      <div className='px-5 sticky top-0 h-[100vh] lg:mt-0'>
        <div className='border'>
          <p className='uppercase font-bold opacity-60 p-4'>Chi tiết thanh toán</p>
          <hr />
          <div className='space-y-3 font-semibold p-3'>
            <div className='flex justify-between pt-3 text-black'>
              <span>Giá</span>
              <span>{convertCurrency(cart.cart?.totalPrice)}</span>
            </div>
            <div className='flex justify-between pt-3 text-black'>
              <span>Tổng số lượng</span>
              <span className='text-black font-bold'>{cart.cart?.totalItem}</span>
            </div>
            <div className='flex justify-between pt-3 '>
              <span>Giảm giá</span>
              <span className='text-green-600'>{convertCurrency(cart.cart?.discounte)}</span>
            </div>
            <div className='flex justify-between pt-3 '>
              <span>Phí Ship</span>
              <span className='text-green-600'>Freeship</span>
            </div>
            <div className='flex justify-between pt-3 font-bold'>
              <span>Tổng cộng</span>
              <span className='text-green-600'>{convertCurrency(cart.cart?.totalDiscountedPrice)}</span>
            </div>
          </div>
        </div>
          <Button onClick={handleCheckout} className='w-full' variant='contained' sx={{px:"2.5rem",mt:".7rem",py:"1rem"}}>
                Thanh toán
          </Button>
      </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default Cart