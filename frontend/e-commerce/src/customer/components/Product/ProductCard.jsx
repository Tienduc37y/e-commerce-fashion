import './ProductCard.css'
import { convertCurrency } from '../../../common/convertCurrency'
const ProductCard = ({product}) => {
  return (
    <div className="productCard w-[15rem] m-3 transition-all cursor-pointer">
        <div className="h-[20rem]">
            <img 
                className="h-full w-full object-cover object-left-top" 
                src={product?.imageUrl} 
                alt={product?.title} />
        </div>
        <div className="textPart bg-white p-3">
            <div>
                <p className="hover:text-red-500">{product?.title}</p>
            </div>
            <div className="flex items-center space-x-2">
                <p className="font-sebold text-red-500">{convertCurrency(product?.discountedPrice)}</p>
                {product?.discountPersent == 0 ? "" : <>
                    <p className="line-through opacity-50">{convertCurrency(product?.price)}</p>
                    <p className="text-red-500 font-semibold">-{product?.discountPersent}%</p>
                </> }
            </div>
        </div>
    </div>
  )
}

export default ProductCard