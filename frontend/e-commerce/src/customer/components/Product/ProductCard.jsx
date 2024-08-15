import React, { useState } from 'react';
import './ProductCard.css'
import '../HomeSectionList/HomeSectionCard.css'
import { convertCurrency } from '../../../common/convertCurrency'
import { Tooltip } from '@mui/material'
import { ShoppingCartIcon } from '@heroicons/react/20/solid'
const ProductCard = ({product}) => {
  const [selectedSize, setSelectedSize] = useState('');

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  return (
    // <div className="productCard w-1/4 rounded-lg overflow-hidden shadow-md transition-transform transform scale-95 hover:scale-100 cursor-pointer">
    //   <div className="overflow-hidden">
    //     <img
    //       className="w-full object-cover object-top h-[25rem] transition-transform duration-300 ease-in-out"
    //       src={product?.imageUrl}
    //       alt={product?.title}
    //     />
    //   </div>
    //   <div className="bg-white p-4">
    //     <Tooltip
    //       title={product?.title}
    //       placement="top-start"
    //       classes={{ tooltip: 'custom-tooltip' }}
    //     >
    //       <p className="product-title font-semibold text-lg">{product?.title}</p>
    //     </Tooltip>
    //     <p className="text-gray-500 text-sm mb-2">{product?.category}</p>
    //     <div className="flex items-baseline justify-between">
    //       <div>
    //         <span className="text-blue-600 font-semibold text-lg">
    //           {convertCurrency(product?.discountedPrice)}
    //         </span>
    //         <span className="line-through text-gray-400 text-sm ml-2">
    //           {convertCurrency(product?.price)}
    //         </span>
    //       </div>
    //       <Tooltip title="Mua hàng" placement="top">
    //         <div className="p-2 bg-gray-200 rounded-full hover:bg-red-500 transition-colors">
    //           <ShoppingCartIcon className="text-gray-500 hover:text-white" />
    //         </div>
    //       </Tooltip>
    //     </div>
    //   </div>
    // </div>
    <div className="productCard rounded-lg overflow-hidden shadow-md cursor-pointer relative">
      <div className="overflow-hidden w-full h-[15rem] sm:h-[25rem]">
        <img
          className="w-full h-full object-cover object-top transition-transform duration-300 ease-in-out transform hover:scale-110"
          src={product?.imageUrl}
          alt={product?.title}
        />
      </div>
      <div className="bg-white p-4 flex flex-col justify-between">
        <div>
          <Tooltip
            title={product?.title}
            placement="top-start"
            classes={{ tooltip: 'custom-tooltip' }}
          >
            <p className="product-title font-semibold text-lg">{product?.title}</p>
          </Tooltip>
          <p className="text-gray-500 text-sm mb-2">{product?.category}</p>
          <div className="flex flex-col items-start mb-2">
            <span className="text-blue-600 font-semibold text-lg">
              {convertCurrency(product?.discountedPrice)}
            </span>
            <span className="line-through text-gray-400 text-sm">
              {convertCurrency(product?.price)}
            </span>
          </div>
        </div>
        {/* Size Selection */}
        <div className="mb-4">
          <div className="flex justify-center gap-2">
            {sizes.map((size) => (
              <label key={size} className={`cursor-pointer p-1 md:p-0 md:w-12 md:h-12 flex justify-center items-center border rounded-lg transition-colors
                ${selectedSize === size ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}
              `}>
                <input
                  type="radio"
                  value={size}
                  checked={selectedSize === size}
                  onChange={handleSizeChange}
                  className="sr-only"
                />
                <span className="text-gray-700">{size}</span>
              </label>
            ))}
          </div>
        </div>

        <Tooltip title="Mua hàng" placement="top">
          <div className="md:p-2 bg-blue-500 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
            <button className='md:text-lg font-semibold text-white flex items-center justify-center'>
              Thêm vào giỏ hàng
            </button>
          </div>
        </Tooltip>
      </div>
      <div className="absolute top-0 right-0 md:m-2 md:px-2 py-1 rounded-full flex items-center">
          <img src="hotsale.svg" alt="Hot Sale" className="size-10 md:size-14" />
      </div>
    </div>
  )
}

export default ProductCard