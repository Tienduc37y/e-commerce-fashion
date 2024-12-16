import React, { useState, useEffect } from 'react'
import { convertCurrency } from '../../../common/convertCurrency'
import { 
  Typography, 
  Box, 
  TextField, 
  Card, 
  CardMedia, 
} from '@mui/material'
import { updateCartItem, removeCartItem, getCart } from '../../../redux/Cart/Action'
import { useDispatch } from 'react-redux'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import IconButton from '@mui/material/IconButton'

const CartItem = ({ cartItem }) => {
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(cartItem?.quantity)

    useEffect(() => {
        setQuantity(cartItem?.quantity)
    }, [cartItem?.quantity])

    const availableQuantity = cartItem?.product?.variants.find(v => v.color === cartItem.color)?.sizes.find(s => s.size === cartItem.size)?.quantityItem || 0

    const handleQuantityChange = (event) => {
        const newQuantity = Number(event.target.value)
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
        } catch (error) {
            console.error("Lỗi khi cập nhật giỏ hàng:", error)
        }
    }

    const handleRemoveCartItem = async () => {
        try {
            await dispatch(removeCartItem(cartItem?._id))
            dispatch(getCart())
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error)
        }
    }

    const selectedVariant = cartItem?.product?.variants.find(v => v.color === cartItem.color)

    return (
        <Card sx={{ display: 'flex', mb: 2, height: 120, position: 'relative' }}>
            <Box sx={{ width: 80, height: '100%' }}>
                <CardMedia
                    component="img"
                    sx={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center'
                    }}
                    image={selectedVariant?.imageUrl}
                    alt={cartItem?.product?.title}
                />
            </Box>
            {/* Container cho phần còn lại */}
            <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'space-between', p: 2, width: 'calc(100% - 120px)' }}>
                {/* Phần 2: Thông tin sản phẩm */}
                <Box sx={{ width: '30%', mr: 2 }}>
                    <Typography component="div" variant="h6" noWrap>
                        {cartItem?.product?.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box
                            sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: selectedVariant?.color,
                                mr: 1,
                                border: '1px solid #ccc'
                            }}
                        />
                        <Typography variant="subtitle1" color="text.secondary" component="span">
                            {selectedVariant?.nameColor} • {cartItem?.size}
                        </Typography>
                    </Box>
                </Box>

                {/* Phần 3: Giá */}
                <Box sx={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {convertCurrency(cartItem?.discountedPrice)}
                    </Typography>
                    <Typography sx={{ textDecoration: 'line-through' }} variant="body2" color="text.secondary" component="div">
                        {convertCurrency(cartItem?.price)}
                    </Typography>
                </Box>

                {/* Phần 4: Số lượng */}
                <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', mr: 1 }}>
                        Số lượng:
                    </Typography>
                    <TextField
                        value={quantity}
                        onChange={handleQuantityChange}
                        type="number"
                        InputProps={{
                            inputProps: { 
                                min: 1, 
                                max: availableQuantity,
                                style: { textAlign: 'center', width: '40px', padding: '2px' }
                            }
                        }}
                        variant="outlined"
                        size="small"
                    />
                </Box>
            </Box>

            <IconButton 
                aria-label="delete"
                onClick={handleRemoveCartItem}
                sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    right: 10, 
                    transform: 'translateY(-50%)',
                    color: 'red', 
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease'
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>
        </Card>
    )
}

export default CartItem
