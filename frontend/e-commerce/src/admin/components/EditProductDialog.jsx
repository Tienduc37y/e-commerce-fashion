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

const EditProductDialog = ({ open, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = React.useState(product);
  const [selectedSize, setSelectedSize] = useState('');

  React.useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSize = () => {
    if (selectedSize && !editedProduct.sizes.some(s => s.size === selectedSize)) {
      setEditedProduct(prev => ({
        ...prev,
        sizes: [...prev.sizes, { size: selectedSize, colors: [] }]
      }));
      setSelectedSize(''); // Reset selected size after adding
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
    setEditedProduct(prev => {
      const newSizes = [...prev.sizes];
      newSizes[sizeIndex].colors[colorIndex][field] = value;
      return { ...prev, sizes: newSizes };
    });
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
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <Paper sx={{ minHeight: '100vh', overflow: 'auto' }}>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary">Chỉnh sửa Sản phẩm</Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box p={2}>
              <TextField
                margin="dense"
                label="ID"
                name="id"
                value={editedProduct?.id || ""}
                fullWidth
                disabled
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Tiêu đề"
                name="title"
                value={editedProduct?.title || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Mô tả"
                name="description"
                value={editedProduct?.description || ""}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Thương hiệu"
                name="brand"
                value={editedProduct?.brand || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Danh mục"
                name="category"
                value={editedProduct?.category || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Giá"
                name="price"
                type="number"
                value={editedProduct?.price || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Giá sau giảm"
                name="discountedPrice"
                type="number"
                value={editedProduct?.discountedPrice || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Phần trăm giảm giá"
                name="discountedPersent"
                type="number"
                value={editedProduct?.discountedPersent || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Box mt={3}>
                <Typography variant="h6" color="primary">Kích thước và Màu sắc</Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <FormControl sx={{ minWidth: 120, mr: 2 }}>
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
                    <TextField
                      label="URL hình ảnh"
                      value={image.image}
                      onChange={(e) => handleImageChange(index, 'image', e.target.value)}
                      sx={{ mr: 1, flexGrow: 1 }}
                    />
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
      </Dialog>
    </ThemeProvider>
  );
};

export default EditProductDialog;