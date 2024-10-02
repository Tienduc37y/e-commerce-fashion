import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Box,
  ThemeProvider,
  createTheme,
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../redux/Product/Action';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4dabf5',
      light: '#80cbc4',
      dark: '#087f23',
    },
    secondary: {
      main: '#ff80ab',
      light: '#ffb2dd',
      dark: '#c94f7c',
    },
    error: {
      main: '#ff6e6e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
});

const AddProductDialog = ({ onClose, onProductCreated }) => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    brand: '',
    topLevelCategory: '',
    secondLevelCategory: '',
    thirdLevelCategory: '',
    price: '',
    discountedPersent: '',
    discountedPrice: '',
    sizes: [],
    quantity: 0,
    images: [],
  });

  const [selectedSize, setSelectedSize] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'price' || name === 'discountedPersent' ? {
        discountedPrice: name === 'price' ? 
          value * (1 - productData.discountedPersent / 100) : 
          productData.price * (1 - value / 100)
      } : {})
    }));
  };

  const handleSizeSelect = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleAddSize = () => {
    if (selectedSize && !productData.sizes.some(s => s.size === selectedSize)) {
      setProductData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { size: selectedSize, colors: [] }]
      }));
      setSelectedSize('');
    }
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...productData.sizes];
    newSizes[index].size = value;
    setProductData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleAddColor = (sizeIndex) => {
    const newSizes = [...productData.sizes];
    newSizes[sizeIndex].colors.push({ color: '', quantityItem: 0 });
    setProductData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleColorChange = (sizeIndex, colorIndex, field, value) => {
    const newSizes = [...productData.sizes];
    newSizes[sizeIndex].colors[colorIndex][field] = value;
    setProductData(prev => ({ 
      ...prev, 
      sizes: newSizes,
      quantity: newSizes.reduce((total, size) => 
        total + size.colors.reduce((sizeTotal, color) => sizeTotal + Number(color.quantityItem), 0), 0
      )
    }));
  };

  const handleRemoveColor = (sizeIndex, colorIndex) => {
    const newSizes = [...productData.sizes];
    newSizes[sizeIndex].colors.splice(colorIndex, 1);
    setProductData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleRemoveSize = (index) => {
    const newSizes = [...productData.sizes];
    newSizes.splice(index, 1);
    setProductData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleAddImage = () => {
    setProductData(prev => ({
      ...prev,
      images: [...prev.images, { file: null, color: '' }]
    }));
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...productData.images];
    newImages[index][field] = value;
    setProductData(prev => ({ ...prev, images: newImages }));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...productData.images];
    newImages.splice(index, 1);
    setProductData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        productData.images.forEach((img, index) => {
          formData.append(`images`, img.file);
          formData.append(`color[${index}]`, img.color);
        });
      } else if (key === 'sizes') {
        formData.append('sizes', JSON.stringify(productData.sizes));
      } else {
        formData.append(key, productData[key]);
      }
    });

    dispatch(createProduct(formData))
      .then(() => {
        console.log('create success');
        toast.success('Sản phẩm đã được tạo thành công!');
        onProductCreated();
        onClose();
      })
      .catch(error => {
        console.error('Error creating product:', error);
        toast.error('Có lỗi xảy ra khi tạo sản phẩm!');
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper 
        elevation={3} 
        sx={{ 
          backgroundColor: 'background.paper', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" color="primary">Thêm mới sản phẩm</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
          
        </DialogTitle>
        <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Box sx={{ padding: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Tiêu đề"
              name="title"
              value={productData.title}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mô tả"
              name="description"
              multiline
              rows={4}
              value={productData.description}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Thương hiệu"
              name="brand"
              value={productData.brand}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              sx={{mr:0.5}}
              margin="normal"
              label="Danh mục cấp 1"
              name="topLevelCategory"
              value={productData.topLevelCategory}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              sx={{mr:0.5}}
              margin="normal"
              label="Danh mục cấp 2"
              name="secondLevelCategory"
              value={productData.secondLevelCategory}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              label="Danh mục cấp 3"
              name="thirdLevelCategory"
              value={productData.thirdLevelCategory}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              sx={{mr:0.5}}
              margin="normal"
              label="Giá"
              name="price"
              type="number"
              value={productData.price}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              sx={{mr:0.5}}
              margin="normal"
              label="Phần trăm giảm giá"
              name="discountedPersent"
              type="number"
              value={productData.discountedPersent}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              label="Giá sau giảm"
              name="discountedPrice"
              type="number"
              value={productData.discountedPrice}
              disabled
              variant="outlined"
            />         
            <Box mt={3} display="flex" alignItems="center">
              <FormControl fullWidth sx={{ mr: 2 }}>
                <InputLabel>Chọn kích thước</InputLabel>
                <Select
                  value={selectedSize}
                  onChange={handleSizeSelect}
                  label="Chọn kích thước"
                >
                  <MenuItem value="S">S</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="L">L</MenuItem>
                  <MenuItem value="XL">XL</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddSize}
                startIcon={<AddIcon />}
                disabled={!selectedSize}
                sx={{ 
                  fontWeight: 'bold',
                  boxShadow: '0 3px 5px 2px rgba(77, 171, 245, .3)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    boxShadow: '0 6px 10px 4px rgba(77, 171, 245, .3)',
                  },
                }}
              >
                Thêm kích thước
              </Button>
            </Box>
            
            {productData.sizes.map((size, sizeIndex) => (
              <Box key={sizeIndex} mt={2} p={2} border={1} borderRadius={2} borderColor="primary.light">
                <Typography variant="h6">{`Kích thước: ${size.size}`}</Typography>
                
                {size.colors.map((color, colorIndex) => (
                  <Box key={colorIndex} display="flex" alignItems="center" mt={1}>
                    <TextField
                      label="Màu sắc"
                      value={color.color}
                      onChange={(e) => handleColorChange(sizeIndex, colorIndex, 'color', e.target.value)}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <TextField
                      label="Số lượng"
                      type="number"
                      value={color.quantityItem}
                      onChange={(e) => handleColorChange(sizeIndex, colorIndex, 'quantityItem', e.target.value)}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <IconButton 
                      onClick={() => handleRemoveColor(sizeIndex, colorIndex)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                
                <Box mt={1}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleAddColor(sizeIndex)}
                    startIcon={<AddIcon />}
                    sx={{ mr: 1 }}
                  >
                    Thêm màu
                  </Button>
                  <IconButton 
                    onClick={() => handleRemoveSize(sizeIndex)} 
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
            
            <TextField
              margin="normal"
              label="Tổng số lượng"
              name="quantity"
              type="number"
              value={productData.quantity}
              disabled
              variant="outlined"
            />
            <Box mt={2}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleAddImage}
                startIcon={<AddIcon />}
                sx={{ 
                  fontWeight: 'bold',
                  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    boxShadow: '0 6px 10px 4px rgba(33, 150, 243, .3)',
                  },
                }}
              >
                Thêm ảnh
              </Button>
            </Box>
            
            {productData.images.map((image, index) => (
              <Box key={index} mt={2} display="flex" alignItems="center">
                <TextField
                  label="Màu sắc"
                  value={image.color}
                  onChange={(e) => handleImageChange(index, 'color', e.target.value)}
                />
                <input
                  type="file"
                  onChange={(e) => handleImageChange(index, 'file', e.target.files[0])}
                />
                <IconButton onClick={() => handleRemoveImage(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2, backgroundColor: 'background.paper' }}> {/* Đảm bảo màu nền cho phần actions */}
          <Button 
            onClick={onClose} 
            color="secondary"
            sx={{ 
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              },
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            sx={{ 
              fontWeight: 'bold',
              boxShadow: '0 3px 5px 2px rgba(77, 171, 245, .3)',
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                boxShadow: '0 6px 10px 4px rgba(77, 171, 245, .3)',
              },
            }}
          >
            Tạo sản phẩm
          </Button>
        </DialogActions>
      </Paper>
    </ThemeProvider>
  );
};

export default AddProductDialog;