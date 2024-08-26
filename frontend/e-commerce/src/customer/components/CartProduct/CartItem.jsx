import React from 'react'
import { convertCurrency } from '../../../common/convertCurrency'
import { Button, IconButton } from '@mui/material'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
const CartItem = () => {
  return (
    <div className='p-5 shadow-lg border rounded-md'>
        <div className='flex items-center'>
            <div className='w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]'>
                <img src="https://canifa.com/img/500/750/resize/8/t/8tp24s004-sa422-thumba.webp" alt="ảnh" className='w-full h-full object-cover object-top' />
            </div>
            <div className='ml-5 space-y-1'>
                <p className='font-semibold'>Áo sơ mi cổ cao đẹp vl</p>
                <p className='opacity-70'>Size:S , White</p>
                <div className='flex flex-col items-start pt-10 text-gray-900'>
                <span className="text-blue-600 font-semibold text-lg">
                    435
                </span>
                <span className="line-through text-gray-400 text-sm">
                    43543
                </span>
                </div>
            </div>
        </div>
            <div className='lg:flex items-center lg:space-x-10 pt-4'>
                <div className='flex items-center space-x-2'>
                    <IconButton >
                        <RemoveCircleOutlinedIcon/>
                    </IconButton>
                    <span className='py-1 px-7 border rounded-sm'>3</span>
                    <IconButton sx={{color:"RGB(145 85 253)"}} >
                        <AddCircleOutlinedIcon/>
                    </IconButton>
                    <div>
                        <Button>Remove</Button>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default CartItem