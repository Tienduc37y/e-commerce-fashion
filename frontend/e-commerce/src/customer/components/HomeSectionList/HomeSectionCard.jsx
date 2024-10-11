import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

const SizeButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(0.5, 1),
  margin: theme.spacing(0, 0.5),
  backgroundColor: 'white',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const ColorButton = styled(IconButton)(({ theme, selected }) => ({
  width: '1.5rem',
  height: '1.5rem',
  padding: 0,
  border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
  margin: theme.spacing(0, 0.5),
  '&:hover': {
    opacity: 0.8,
  },
}));

const HomeSectionCard = ({ product }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // Lấy ra tất cả các màu duy nhất từ product
  const uniqueColors = useMemo(() => {
    const colorSet = new Set();
    product?.sizes?.forEach(size => {
      size.colors.forEach(colorObj => {
        colorSet.add(colorObj.color);
      });
    });
    return Array.from(colorSet);
  }, [product]);

  // Chọn ngẫu nhiên một màu từ uniqueColors
  const [selectedColor, setSelectedColor] = useState(() => {
    if (uniqueColors.length > 0) {
      const randomIndex = Math.floor(Math.random() * uniqueColors.length);
      return uniqueColors[randomIndex];
    }
    return '';
  });

  const [showSizes, setShowSizes] = useState(false);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    setShowSizes(true);
  };

  const handleSizeSelect = (size) => {
    console.log(`Selected size: ${size}`);
    navigate("/cart", { replace: true });
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

  return (
    <StyledCard ref={cardRef}>
      <Box sx={{ position: 'relative' }}>
        <StyledCardMedia
          title={product?.title}
          onClick={() => navigate(`/product/${product?._id}`, { replace: true })}
        >
          <img src={product?.imageUrl[0].image} alt={product?.title} />
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
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
                px:0.5,
                py:1,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                height: '2rem',
              }}
            >
              Thêm vào giỏ hàng
            </Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <SizeButton
                  key={size}
                  variant="contained"
                  onClick={() => handleSizeSelect(size)}
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
        {/* Thêm phần chọn màu sắc ở đây */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {uniqueColors.map((color) => (
            <Tooltip key={color} title={color.replace(/_/g, ' ')}>
              <ColorButton
                onClick={() => handleColorChange(color)}
                selected={selectedColor === color}
              >
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  {color.charAt(0).toUpperCase()}
                </Typography>
              </ColorButton>
            </Tooltip>
          ))}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default HomeSectionCard;