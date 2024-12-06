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
  [theme.breakpoints.down('sm')]: {
    '& .MuiCardContent-root': {
      padding: '8px',
    }
  }
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
  [theme.breakpoints.down('sm')]: {
    height: '15rem',
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

// Thêm styled component mới cho view count
const ViewCount = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 10,
  top: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  zIndex: 1,
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
    
    const cartItem = {
      productId: product._id,
      size: size,
      color: selectedColor,
      quantity: 1,
    };
    
    dispatch(addItemToCart(cartItem))
      .then(() => {
        dispatch(getCart())
        toast.success('Sản phẩm đã được thêm vào giỏ hàng');
        setSelectedSize(null);
        setShowSizes(false);
      })
      .catch((error) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
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

        {/* Thêm view count */}
        <ViewCount>
          <i className="fas fa-eye" style={{ fontSize: '12px' }}></i>
          {product?.view || 0} lượt xem
        </ViewCount>

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
          <Typography 
            onClick={() => navigate(`/product/${product?.slugProduct}/${product?._id}`, { replace: true })}
            sx={{
              cursor:'pointer',
              ":hover":{color:'red'},
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }} 
            variant="span" 
            component="div" 
            noWrap
          >
            {product?.title}
          </Typography>
        </Tooltip>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          {product?.brand}
        </Typography>
        <Box sx={{ 
          height: { xs: '2.5rem', sm: '3.5rem' },
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {uniqueColors.map(({ color, nameColor }) => (
            <Tooltip key={color} title={nameColor}>
              <ColorButton
                onClick={() => handleColorChange(color)}
                selected={selectedColor === color}
                color={color}
                sx={{
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    right: -1,
                    bottom: -1,
                    borderRadius: '50%',
                    background: 'white',
                    zIndex: -1,
                  }
                }}
              />
            </Tooltip>
          ))}
          <Box sx={{ flexGrow: 1 }} />
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5 
            }}
          >
            <i className="fas fa-shopping-cart" style={{ fontSize: '12px' }}></i>
            Đã bán {product?.sellQuantity || 0}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default HomeSectionCard;
