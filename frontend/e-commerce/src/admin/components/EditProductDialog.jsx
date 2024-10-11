import React, { useState, useEffect } from 'react';
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
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import {theme} from '../theme/theme';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  '& .MuiDialog-paper': {
    width: '50%',
    height: '100%',
    maxHeight: '100%',
    margin: 0,
    borderRadius: 0,
    position: 'fixed',
    top: 0,
    right: 0,
  },
}));

const EditProductDialog = ({ open, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(product || {});
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
      updateDiscountedPrice(product.price, product.discountedPersent);
    }
  }, [product]);

  const updateDiscountedPrice = (price, discountPercent) => {
    const discountedPrice = price - (price * discountPercent / 100);
    setEditedProduct(prev => ({
      ...prev,
      discountedPrice: Math.round(discountedPrice)
    }));
  };

  const updateTotalQuantity = (sizes) => {
    const totalQuantity = sizes.reduce((total, size) => {
      return total + size.colors.reduce((sizeTotal, color) => sizeTotal + Number(color.quantityItem || 0), 0);
    }, 0);
    setEditedProduct(prev => ({
      ...prev,
      quantity: totalQuantity
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'topLevelCategory' || name === 'secondLevelCategory' || name === 'thirdLevelCategory') {
      setEditedProduct(prev => ({
        ...prev,
        category: {
          ...prev.category,
          [name]: value
        }
      }));
    } else {
      setEditedProduct(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'price' || name === 'discountedPersent') {
      updateDiscountedPrice(
        name === 'price' ? Number(value) : editedProduct.price,
        name === 'discountedPersent' ? Number(value) : editedProduct.discountedPersent
      );
    }
  };

  const handleAddSize = () => {
    if (selectedSize && !editedProduct.sizes.some(s => s.size === selectedSize)) {
      setEditedProduct(prev => ({
        ...prev,
        sizes: [...prev.sizes, { size: selectedSize, colors: [] }]
      }));
      setSelectedSize('');
    }
  };

  const handleRemoveSize = (index) => {
    setEditedProduct(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleAddColor = (sizeIndex) => {
    setEditedProduct(prev => {
      const newSizes = [...prev.sizes];
      newSizes[sizeIndex].colors.push({ color: '', quantityItem: 0 });
      return { ...prev, sizes: newSizes };
    });
  };

  const handleColorChange = (sizeIndex, colorIndex, field, value) => {
    const newSizes = [...editedProduct.sizes];
    newSizes[sizeIndex].colors[colorIndex][field] = value;
    setEditedProduct(prev => ({ 
      ...prev, 
      sizes: newSizes
    }));
    updateTotalQuantity(newSizes);
  };

  const handleRemoveColor = (sizeIndex, colorIndex) => {
    setEditedProduct(prev => {
      const newSizes = [...prev.sizes];
      newSizes[sizeIndex].colors.splice(colorIndex, 1);
      return { ...prev, sizes: newSizes };
    });
  };

  const handleAddImage = () => {
    setEditedProduct(prev => ({
      ...prev,
      imageUrl: [...prev.imageUrl, { image: '', color: '' }]
    }));
  };

  const handleImageChange = (index, field, value) => {
    setEditedProduct(prev => {
      const newImages = [...prev.imageUrl];
      newImages[index][field] = value;
      return { ...prev, imageUrl: newImages };
    });
  };

  const handleRemoveImage = (index) => {
    setEditedProduct(prev => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(editedProduct);
  };

  return (
    <ThemeProvider theme={theme}>
      <CustomDialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth={false}
      >
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
            <Typography variant="h5" color="primary">Chỉnh sửa Sản phẩm</Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Box sx={{ padding: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="ID"
                name="id"
                value={editedProduct?.id || ""}
                disabled
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Tiêu đề"
                name="title"
                value={editedProduct?.title || ""}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Mô tả"
                name="description"
                value={editedProduct?.description || ""}
                onChange={handleInputChange}
                multiline
                rows={4}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Thương hiệu"
                name="brand"
                value={editedProduct?.brand || ""}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                margin="normal"
                label="Danh mục cấp 1"
                name="topLevelCategory"
                value={editedProduct?.category?.topLevelCategory || ""}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mr: 0.5 }}
              />
              <TextField
                margin="normal"
                label="Danh mục cấp 2"
                name="secondLevelCategory"
                value={editedProduct?.category?.secondLevelCategory || ""}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mr: 0.5 }}
              />
              <TextField
                margin="normal"
                label="Danh mục cấp 3"
                name="thirdLevelCategory"
                value={editedProduct?.category?.thirdLevelCategory || ""}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                margin="normal"
                label="Giá"
                name="price"
                type="number"
                value={editedProduct?.price || ""}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mr: 0.5 }}
              />
              <TextField
                margin="normal"
                label="Phần trăm giảm giá"
                name="discountedPersent"
                type="number"
                value={editedProduct?.discountedPersent || ""}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mr: 0.5 }}
              />
              <TextField
                disabled
                margin="normal"
                label="Giá sau giảm"
                name="discountedPrice"
                type="number"
                value={editedProduct?.discountedPrice || ""}
                variant="outlined"
              />

              <Box mt={3}>
                <Typography variant="h6" color="primary">Kích thước và Màu sắc</Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <FormControl fullWidth sx={{ mr: 2 }}>
                    <InputLabel>Kích thước</InputLabel>
                    <Select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      label="Kích thước"
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
                  >
                    Thêm kích thước
                  </Button>
                </Box>
                {editedProduct?.sizes?.map((size, sizeIndex) => (
                  <Box key={sizeIndex} mt={2} p={2} border={1} borderRadius={2} borderColor="primary.light">
                    <Typography variant="subtitle1">Kích thước: {size.size}</Typography>
                    
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
                        <IconButton onClick={() => handleRemoveColor(sizeIndex, colorIndex)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    
                    <Box mt={1}>
                      <Button variant="contained" color="primary" onClick={() => handleAddColor(sizeIndex)} startIcon={<AddIcon />}>
                        Thêm màu
                      </Button>
                      <IconButton onClick={() => handleRemoveSize(sizeIndex)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>

              <TextField
                fullWidth
                margin="normal"
                label="Tổng số lượng"
                name="quantity"
                type="number"
                value={editedProduct?.quantity || 0}
                disabled
                variant="outlined"
                sx={{ mt: 2 }}
              />

              <Box mt={3}>
                <Typography variant="h6" color="primary">Hình ảnh</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAddImage} 
                  startIcon={<AddIcon />} 
                  sx={{ 
                    mt: 2,
                    fontWeight: 'bold',
                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                    '&:hover': {
                      backgroundColor: '#1976d2',
                      boxShadow: '0 6px 10px 4px rgba(33, 150, 243, .3)',
                    },
                  }}
                >
                  Thêm hình ảnh
                </Button>
                {editedProduct?.imageUrl?.map((image, index) => (
                  <Box key={index} mt={2} display="flex" alignItems="center">
                    <TextField
                      label="Màu sắc"
                      value={image.color}
                      onChange={(e) => handleImageChange(index, 'color', e.target.value)}
                      sx={{ mr: 1 }}
                    />
                    <Box sx={{ width: '60px', height: '60px', mr: 1, flexShrink: 0 }}>
                       <img 
                         src={image.image} 
                         alt={`Product ${index + 1}`}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleImageChange(index, 'image', reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <IconButton onClick={() => handleRemoveImage(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: 2, backgroundColor: 'background.paper' }}>
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
              Hủy bỏ
            </Button>
            <Button 
              onClick={handleSave} 
              color="primary" 
              variant="contained"
              sx={{ 
                fontWeight: 'bold',
                boxShadow: '0 3px 5px 2px rgba(77, 171, 245, .3)',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  boxShadow: '0 6px 10px 4px rgba(77, 171, 245, .3)',
                },
              }}
            >
              Lưu thay đổi
            </Button>
          </DialogActions>
        </Paper>
      </CustomDialog>
    </ThemeProvider>
  );
};

export default EditProductDialog;