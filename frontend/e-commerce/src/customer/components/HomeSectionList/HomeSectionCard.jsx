import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  styled,
  IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { convertCurrency } from '../../../common/convertCurrency';
import Tooltip from '@mui/material/Tooltip';
import { addItemToCart, getCart } from '../../../redux/Cart/Action';
import { toast } from 'react-toastify';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  position: 'relative',
  '&:hover .add-to-cart': {
    opacity: 1,
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: '23rem',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top',
    transition: 'transform 0.3s ease-in-out',
  },
}));

const SizeButton = styled(Button)(({ theme, disabled, selected }) => ({
  minWidth: '2rem',
  height: '2rem',
  padding: theme.spacing(0.5),
  margin: theme.spacing(0, 0.5),
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: 'white',
  fontWeight: 'bold',
  border: '1px solid white',
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : 'rgba(255, 255, 255, 0.2)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },
}));

const ColorButton = styled(IconButton)(({ theme, selected, color }) => ({
  width: '1.5rem',
  height: '1.5rem',
  padding: 0,
  backgroundColor: color,
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid #000',
  margin: theme.spacing(0, 0.5),
}));

const HomeSectionCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardRef = useRef(null);

  // Lấy ra tất cả các màu duy nhất từ variants
  const uniqueColors = useMemo(() => {
    return product?.variants?.map(variant => ({
      color: variant.color,
      nameColor: variant.nameColor,
      imageUrl: variant.imageUrl
    })) || [];
  }, [product]);

  // Chọn ngẫu nhiên một màu từ uniqueColors
  const [selectedColor, setSelectedColor] = useState(() => {
    if (uniqueColors.length > 0) {
      const randomIndex = Math.floor(Math.random() * uniqueColors.length);
      return uniqueColors[randomIndex].color;
    }
    return '';
  });

  const [showSizes, setShowSizes] = useState(false);

  const [selectedSize, setSelectedSize] = useState(null);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    setShowSizes(true);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    console.log(`Selected size: ${size}`);
    
    const cartItem = {
      productId: product._id,
      size: size,
      color: selectedColor,
      quantity: 1,
    };
    
    dispatch(addItemToCart(cartItem))
      .then(() => {
        dispatch(getCart())
        toast.success('Sản phẩm đã được thêm vào giỏ hàng', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setSelectedSize(null);
        setShowSizes(false);
      })
      .catch((error) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  useEffect(() => {
    const handleMouseLeave = () => {
      setShowSizes(false);
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Lấy variant được chọn để hiển thị ảnh
  const selectedVariant = useMemo(() => {
    return product?.variants?.find(v => v.color === selectedColor) || product?.variants?.[0];
  }, [product, selectedColor]);

  const availableSizes = useMemo(() => {
    return selectedVariant?.sizes.reduce((acc, size) => {
      acc[size.size] = size.quantityItem > 0;
      return acc;
    }, {}) || {};
  }, [selectedVariant]);

  const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <StyledCard ref={cardRef}>
      <Box sx={{ position: 'relative' }}>
        <StyledCardMedia
          title={product?.title}
          onClick={() => navigate(`/product/${product?.slugProduct}/${product?._id}`, { replace: true })}
        >
          <img src={selectedVariant?.imageUrl} alt={product?.title} />
        </StyledCardMedia>
        {product?.discountedPersent > 0 && (
          <Box
            component="img"
            src="/hotsale.svg"
            alt="Sale"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 50,
              height: 50,
            }}
          />
        )}
        <Box
          className="add-to-cart"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: 2,
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          {!showSizes ? (
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{
                borderRadius: '9999px',
                px: 0.5,
                py: 1,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                height: '2rem',
              }}
            >
              Thêm vào giỏ hàng
            </Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
              {allSizes.map((size) => (
                <SizeButton
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!availableSizes[size]}
                  selected={selectedSize === size}
                >
                  {size}
                </SizeButton>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      <CardContent>
        <Tooltip title={product?.title} placement="bottom-start">
          <Typography onClick={()=>navigate(`/product/${product?._id}`, { replace: true })} sx={{cursor:'pointer',":hover":{color:'red'}}} variant="span" component="div" noWrap>
            {product?.title}
          </Typography>
        </Tooltip>
        <Typography variant="body2" color="text.secondary" >
          {product?.brand}
        </Typography>
        <Box sx={{ height: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {product?.discountedPrice !== product?.price ? (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {convertCurrency(product?.discountedPrice)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', mr: 1 }}>
                  {convertCurrency(product?.price)}
                </Typography>
                {product?.discountedPersent > 0 && (
                  <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>
                    -{product?.discountedPersent}%
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {convertCurrency(product?.price)}
            </Typography>
          )}
        </Box>
        {/* Thêm phần chọn màu sắc và số lượt xem ở đây */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {uniqueColors.map(({ color, nameColor }) => (
            <Tooltip key={color} title={nameColor}>
              <ColorButton
                onClick={() => handleColorChange(color)}
                selected={selectedColor === color}
                color={color}
              />
            </Tooltip>
          ))}
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {product?.view} lượt xem
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default HomeSectionCard;
