
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { convertCurrency } from '../../../common/convertCurrency';
const HomeSectionCard = ({product}) => {
  return (
    <div className="border-solid border-[1px]">
      <img 
        src={product?.imageUrl} 
        alt=""
        className="w-full h-[12rem] sm:h-[18rem] md:h-[15rem] lg:h-[25rem]"
      />
      <div className="p-2">
        <h3 className="mt-2 text-md text-gray-700 cursor-pointer hover:text-red-500">
          {product?.title}
        </h3>
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-lg font-bold text-red-600">{convertCurrency(product?.discountedPrice)}</span>
        </div>
        {
          product?.discountPersent == 0 ? "" : <>
            <span className='text-sm line-through text-gray-500 mr-2'>{convertCurrency(product?.price)}</span>
            <span className='text-sm font-semibold text-red-500'>-{product?.discountPersent}%</span>
          </>
        }
        <button className="float-right">
          <ShoppingCartIcon/>
        </button>
      </div>
    </div>
  );
};

export default HomeSectionCard;
