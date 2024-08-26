import React from 'react'
import AddressCard from '../AddressCard/AddressCard'
import Cart from '../CartProduct/Cart'
const OrderSummary = () => {
  return (
    <div>
      <div className='p-5 shadow-lg round-s-md border'>
        <AddressCard/>
      </div>
      <Cart/>
    </div>
  )
}

export default OrderSummary