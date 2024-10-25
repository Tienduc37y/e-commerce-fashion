import React, { useState, useEffect, useMemo } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { Radio, RadioGroup, Disclosure } from '@headlessui/react'
import { Rating, Button, Grid, LinearProgress, Box, Typography, Tooltip,styled, IconButton, FormControl, FormControlLabel } from '@mui/material'
import {PlusIcon,MinusIcon} from '@heroicons/react/20/solid'
import ProductReviewCard from './ProductReviewCard'
import HomeSectionList from '../HomeSectionList/HomeSectionList'
import { mens_kurta } from '../../../Data/mens_kurta'
import HomeSectionCard from '../HomeSectionList/HomeSectionCard'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { findProductsById, findProducts, incrementProductView } from '../../../redux/Product/Action'
import { convertCurrency } from '../../../common/convertCurrency'
import { addItemToCart, getCart } from '../../../redux/Cart/Action'
import { toast, ToastContainer } from 'react-toastify'
const ColorButton = styled(IconButton)(({ theme, selected }) => ({
  width: '3rem',
  height: '3rem',
  padding: 0,
  border: selected ? `3px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
  margin: theme.spacing(0, 0.5),
  '&:hover': {
    opacity: 0.8,
  },
}));

const SizeButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '3rem',
  height: '3rem',
  margin: theme.spacing(0.5),
  borderRadius: '50%',
  border: '1px solid',
  borderColor: selected ? theme.palette.primary.main : theme.palette.grey[300],
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: selected ? 'bold' : 'normal',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [availableSizes, setAvailableSizes] = useState([])
  const [availableQuantity, setAvailableQuantity] = useState(0)
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const product = useSelector(store => store.product)
  useEffect(() => {
    if (params.productId) {
      dispatch(findProductsById(params.productId));
      dispatch(incrementProductView(params.productId));
    }
  }, [params.productId, dispatch]);

  useEffect(() => {
    if (product.product?.category?.thirdLevelCategory?.slugCategory) {
      const slugCategory = product.product.category.thirdLevelCategory.slugCategory;
      const data = {
        topLevelCategory: "",
        secondLevelCategory: "",
        thirdLevelCategory: slugCategory,
        colors: [],
        sizes: [],
        minPrice: 0,
        maxPrice: 100000000000,
        minDiscount: 0,
        sort: "price_low",
        pageNumber: 1,
        pageSize: 10,
        stock: ""
      };
      dispatch(findProducts(data));
    }
  }, [product.product, dispatch]);

  const uniqueColors = useMemo(() => {
    return product?.product?.variants?.map(variant => variant.color) || [];
  }, [product]);

  useEffect(() => {
    if (uniqueColors.length > 0) {
      setSelectedColor(uniqueColors[0]);
    }
  }, [uniqueColors]);

  useEffect(() => {
    if (selectedColor && product?.product?.variants) {
      const variant = product.product.variants.find(v => v.color === selectedColor);
      if (variant) {
        const sizes = variant.sizes.map(s => s.size);
        setAvailableSizes(sizes);
        setSelectedSize('');
        
        // Tính tổng số lượng cho màu được chọn
        const totalQuantity = variant.sizes.reduce((total, size) => total + size.quantityItem, 0);
        setAvailableQuantity(totalQuantity);
      }
    }
  }, [selectedColor, product]);

  useEffect(() => {
    if (selectedColor && selectedSize && product?.product?.variants) {
      const variant = product.product.variants.find(v => v.color === selectedColor);
      if (variant) {
        const sizeObj = variant.sizes.find(s => s.size === selectedSize);
        if (sizeObj) {
          setAvailableQuantity(sizeObj.quantityItem);
        }
      }
    }
  }, [selectedColor, selectedSize, product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(''); // Reset size when color changes
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (selectedSize && selectedColor) {
      const cartItem = {
        productId: product.product?._id,
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
      };
      try {
        await dispatch(addItemToCart(cartItem))
        await dispatch(getCart())
        toast.success("Sản phẩm đã được thêm vào giỏ hàng")
      } catch (error) {
        toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng: " + error.message)
      }
    } else {
      toast.warn("Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng")
    }
  };

  return (
    <div className="bg-white py-10 px-4 lg:px-20">
      <div className="pt-6">
        {/* Product info */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            {/* Image gallery */}
            <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-lg w-full max-h-[48rem]">
                <img
                alt={product.product?.title}
                src={product.product?.variants.find(v => v.color === selectedColor)?.imageUrl || product.product?.variants[0]?.imageUrl}
                className="h-full w-full object-contain "
                />
            </div>
            {/* Thêm phần hiển thị các ảnh nhỏ */}
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {product.product?.variants.map((variant) => (
                <img
                  key={variant.color}
                  src={variant.imageUrl}
                  alt={variant.nameColor}
                  className={`w-16 h-16 object-cover cursor-pointer ${selectedColor === variant.color ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => handleColorChange(variant.color)}
                />
              ))}
            </div>
            </div>

            {/* Product info */}
            <div className="lg:col-span-1 mx-auto w-full px-4 pb-16 sm:px-6 lg:pb-24 lg:px-12">
            <div className="lg:col-span-2">
                <h1 className="text-lg lg:text-[3rem] font-semibold text-gray-900">{product.product?.title}</h1>
                <h1 className='text-[2rem] text-gray-900 mt-2'>{product.product?.brand}</h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Thông tin sản phẩm</h2>
                <div className='flex flex-col space-y-2 text-lg lg:text-xl text-gray-900 mt-6'>
                    <div className='flex items-center space-x-2'>
                        {product.product?.discountedPersent > 0 ? (
                          <>
                            <p className='opacity-50 line-through'>{convertCurrency(product.product?.price)}</p>
                            <p className='text-red-600 font-bold'>-{product.product?.discountedPersent}%</p>
                          </>
                        ) : null}
                    </div>
                    <p className='font-semibold text-3xl'>{convertCurrency(product.product?.discountedPrice)}</p>
                </div>

                {/* Reviews */}
                <div className="mt-6">
                    <div className='flex items-center space-x-3'>
                        <Rating name="read-only" value={5.5} readOnly />
                        <p className='opacity-50 text-sm'>56654 Ratings</p>
                        <p className='ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500'>3870 Reviews</p>
                        <p className='ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500'>{product.product?.view} Views</p>
                    </div>
                </div>

                <form className="mt-10">
                {/* Colors */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Màu sắc</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {product.product?.variants.map((variant) => (
                      <Tooltip key={variant.color} title={variant.nameColor}>
                        <ColorButton
                          onClick={() => handleColorChange(variant.color)}
                          selected={selectedColor === variant.color}
                          style={{ backgroundColor: variant.color }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>

                {/* Sizes */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Kích thước</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <SizeButton
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        selected={selectedSize === size}
                        disabled={!availableSizes.includes(size)}
                      >
                        {size}
                      </SizeButton>
                    ))}
                  </Box>
                </Box>

                  <Typography variant="body1" sx={{mb:2}}>
                    Số lượng có sẵn: <strong className='text-red-600'>{availableQuantity}</strong>
                  </Typography>
                  <Button 
                    onClick={handleAddToCart} 
                    variant='contained' 
                    sx={{px:"2rem", py:"1rem"}}
                    disabled={!selectedSize || !selectedColor || availableQuantity === 0}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <Disclosure as="div" className="border-b border-gray-200 py-6">
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Mô tả</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                      <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-6">
                  <div className="space-y-4">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-600">
                          {product?.product?.description}
                        </p>
                      </div>
                  </div>
                </Disclosure.Panel>
              </Disclosure>
              <Disclosure as="div" className="border-b border-gray-200 py-6">
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Bảo Quản</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                      <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-6 w-full">
                  <div className="space-y-4">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-600">
                          Giặt máy ở chế độ nhẹ, nhiệt độ thường.
                          Không sử dụng hóa chất tẩy có chứa Clo.
                          Phơi trong bóng mát.
                          Sấy khô ở nhiệt độ thấp.
                          Là ở nhiệt độ thấp 110 độ C.
                          Giặt với sản phẩm cùng màu.
                          Không là lên chi tiết trang trí.
                        </p>
                      </div>
                  </div>
                </Disclosure.Panel>
              </Disclosure>
            </div>
            </div>
        </section>
        {/* Rating and comment */}
        <section className='pt-10'>
      <h1 className='font-semibold text-lg pb-4'>Đánh giá nhận xét</h1>
      <div className='border p-5'>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <div className='space-y-5'>
              {[1, 1, 1, 1, 1].map((item, index) => (
                <ProductReviewCard key={index} />
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={5}>
            <h1 className='text-xl font-semibold pb-1'>Đánh giá</h1>
            <div className='flex items-center space-x-3'>
              <Rating name='read-only' value={4.6} precision={0.5} readOnly />
              <p className='opacity-60'>21443 đánh giá</p>
            </div>
            <Box className="mt-5 space-y-4">
              {['Tốt', 'Khá', 'Trung bình', 'Kém', 'Rất kém'].map((label, index) => (
                <Grid container className='items-center gap-2' key={index}>
                  <Grid item xs={3} sm={2}>
                    <p>{label}</p>
                  </Grid>
                  <Grid item xs={9} sm={10}>
                    <LinearProgress
                      sx={{ bgcolor: "#d0d0d0", borderRadius: 4, height: 7 }}
                      variant='determinate'
                      value={40}
                      color='success'
                    />
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
        </Grid>
      </div>
        </section>
        {/* Similar product */}
        <section className='pt-10'>
          <h1 className='py-5 text-xl font-semibold'>Sản phẩm cùng loại</h1>
          <div className='flex flex-wrap gap-y-6 -mx-2 lg:-mx-4'>
            {product.products?.slice(0,8).map((item,index) => <div
            key={index}
            className="px-2 md:px-4 flex-shrink-0 w-1/2 md:w-1/2 lg:w-1/4"
        >
            <HomeSectionCard product={item} />
        </div>)}
          </div>
        </section>

        
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
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
