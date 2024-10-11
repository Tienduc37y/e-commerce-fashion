import React, { useMemo, useState, useEffect } from 'react'
import { convertCurrency } from '../../../common/convertCurrency'
import { Button, Typography, Box, styled, TextField } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import { updateCartItem, removeCartItem, getCart } from '../../../redux/Cart/Action';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const ColorCircle = styled('div')(({ theme }) => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[200],
  border: '1px solid #ddd',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '8px',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

const CartItem = ({ cartItem }) => {
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(cartItem?.quantity)

    useEffect(() => {
        setQuantity(cartItem?.quantity)
    }, [cartItem?.quantity])

    const availableQuantity = useMemo(() => {
        const sizeObj = cartItem?.product?.sizes.find(s => s.size === cartItem?.size);
        if (sizeObj) {
            const colorObj = sizeObj.colors.find(c => c.color === cartItem?.color);
            return colorObj ? colorObj.quantityItem : 0;
        }
        return 0;
    }, [cartItem]);

    const handleQuantityChange = (event) => {
        const newQuantity = Number(event.target.value);
        if (newQuantity >= 1 && newQuantity <= availableQuantity) {
            setQuantity(newQuantity)
            updateCart(newQuantity)
        }
    }

    const updateCart = async (newQuantity) => {
        const data = {
            quantity: newQuantity,
            cartItemId: cartItem?._id
        }
        try {
            await dispatch(updateCartItem(data))
            dispatch(getCart())
            toast.success("Cập nhật số lượng sản phẩm thành công")
        } catch (error) {
            console.error("Lỗi khi cập nhật giỏ hàng:", error)
        }
    }

    const handleRemoveCartItem = async () => {
        try {
            await dispatch(removeCartItem(cartItem?._id))
            dispatch(getCart())
            toast.success("Xóa sản phẩm khỏi giỏ hàng thành công")
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error)
        }
    }

    return (
        <div className='p-5 shadow-lg border rounded-md relative'>
            <div className='flex items-center'>
                <div className='flex flex-col gap-2 items-center w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]'>
                    <img src={cartItem?.product?.imageUrl[0].image} alt={cartItem?.product?.title} className='w-full h-full object-cover object-top' />
                </div>
                <div className='ml-5 space-y-1 flex-grow'>
                    <p className='font-semibold'>{cartItem?.product?.title}</p>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            Màu sắc: 
                            <Tooltip title={cartItem?.color}>
                                <ColorCircle className='ml-2'>{cartItem?.color?.charAt(0).toUpperCase()}</ColorCircle>
                            </Tooltip>
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2">Kích thước: {cartItem?.size}</Typography>
                    </Box>
                    <div className='flex items-center space-x-2'>
                        <TextField
                            value={quantity}
                            onChange={handleQuantityChange}
                            type="number"
                            InputProps={{
                                inputProps: { 
                                    min: 1, 
                                    max: availableQuantity,
                                    style: { textAlign: 'center', width: '50px' }
                                }
                            }}
                            variant="outlined"
                            size="small"
                        />
                    </div>
                    <div className='flex flex-col items-start pt-5 text-gray-900'>
                        <span className="text-blue-600 font-semibold text-lg">
                            {convertCurrency(cartItem?.discountedPrice)}
                        </span>
                        <span className="line-through text-gray-400 text-sm">
                            {convertCurrency(cartItem?.price)}
                        </span>
                    </div>
                </div>
            </div>
            <Button 
                onClick={handleRemoveCartItem}
                variant="text"
                color="error"
                sx={{ position: 'absolute', bottom: '16px', right: '16px' }}
            >
                Remove
            </Button>
        </div>
    )
}

export default CartItem