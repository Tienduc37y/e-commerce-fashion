import React, { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Tooltip } from '@mui/material';
import './HomeSectionCard.css';
import '../Product/ProductCard.css';
import { convertCurrency } from '../../../common/convertCurrency';
import { useNavigate } from 'react-router-dom';

const HomeSectionCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const navigate = useNavigate()
  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };
  const handleAddToCart = () => {
    navigate("/cart",{ replace: true })
  }

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="productCard rounded-lg overflow-hidden shadow-md cursor-pointer relative">
      <div  onClick={() => navigate(`/product/${5}`,{ replace: true })} className="overflow-hidden w-full h-[15rem] sm:h-[25rem]">
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
            <button onClick={()=>handleAddToCart()} className='md:text-lg font-semibold text-white flex items-center justify-center'>
              Thêm vào giỏ hàng
            </button>
          </div>
        </Tooltip>
      </div>
      <div className="absolute top-0 right-0 md:m-2 md:px-2 py-1 rounded-full flex items-center">
          <img src="hotsale.svg" alt="Hot Sale" className="size-10 md:size-14" />
      </div>
    </div>
  );
};

export default HomeSectionCard;
