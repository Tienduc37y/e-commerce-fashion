import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography,
  IconButton, Paper, ThemeProvider, Select, MenuItem, FormControl, InputLabel, Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../../redux/Product/Action';
import { toast } from 'react-toastify';
import { theme } from '../theme/theme';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  '& .MuiDialog-paper': {
    width: '50%',
    maxWidth: 'none',
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
  const dispatch = useDispatch();
  const [editedProduct, setEditedProduct] = useState(null);
  const [colorName, setColorName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [variantInputs, setVariantInputs] = useState([]);

  useEffect(() => {
    if (product) {
      const initialQuantity = calculateTotalQuantity(product.variants || []);
      setEditedProduct({
        ...product,
        category: product.category || { topLevelCategory: '', secondLevelCategory: '', thirdLevelCategory: '' },
        variants: product.variants || [],
        quantity: initialQuantity,
        sellQuantity: product.sellQuantity || 0
      });
    }
  }, [product]);

  const calculateTotalQuantity = (variants) => {
    return variants.reduce((total, variant) => 
      total + variant.sizes.reduce((sizeTotal, size) => sizeTotal + (Number(size.quantityItem) || 0), 0), 0
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('category.')) {
      const categoryField = name.split('.')[1];
      setEditedProduct(prev => ({
        ...prev,
        category: {
          ...prev.category,
          [categoryField]: value
        }
      }));
    } else {
      setEditedProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...editedProduct.variants];
    newVariants[index][field] = value;
    if (field === 'imageUrl' && value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newVariants[index].imagePreview = e.target.result;
        setEditedProduct(prev => ({ ...prev, variants: newVariants }));
      };
      reader.readAsDataURL(value);
    } else {
      setEditedProduct(prev => ({ ...prev, variants: newVariants }));
    }
  };

  const handleVariantInputChange = (variantIndex, field, value) => {
    const newVariantInputs = [...variantInputs];
    if (!newVariantInputs[variantIndex]) {
      newVariantInputs[variantIndex] = {};
    }
    newVariantInputs[variantIndex][field] = value;
    setVariantInputs(newVariantInputs);
  };

  const handleAddVariant = () => {
    if (colorName && selectedColor) {
      setEditedProduct(prev => ({
        ...prev,
        variants: [
          ...prev.variants,
          { color: selectedColor, nameColor: colorName, sizes: [], imageUrl: '' }
        ]
      }));
      setColorName('');
      setSelectedColor('#000000');
    }
  };

  const handleAddSize = (variantIndex) => {
    const { selectedSize, selectedQuantity } = variantInputs[variantIndex] || {};
    if (selectedSize && selectedQuantity && !editedProduct.variants[variantIndex].sizes.some(s => s.size === selectedSize)) {
      const newVariants = [...editedProduct.variants];
      newVariants[variantIndex].sizes.push({ size: selectedSize, quantityItem: Number(selectedQuantity) });
      const newTotalQuantity = calculateTotalQuantity(newVariants);
      setEditedProduct(prev => ({ 
        ...prev, 
        variants: newVariants,
        quantity: newTotalQuantity
      }));
      handleVariantInputChange(variantIndex, 'selectedSize', '');
      handleVariantInputChange(variantIndex, 'selectedQuantity', '');
    }
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    const newVariants = [...editedProduct.variants];
    newVariants[variantIndex].sizes[sizeIndex][field] = Number(value);
    const newTotalQuantity = calculateTotalQuantity(newVariants);
    setEditedProduct(prev => ({ 
      ...prev, 
      variants: newVariants,
      quantity: newTotalQuantity
    }));
  };

  const handleRemoveSize = (variantIndex, sizeIndex) => {
    const newVariants = [...editedProduct.variants];
    newVariants[variantIndex].sizes.splice(sizeIndex, 1);
    const newTotalQuantity = calculateTotalQuantity(newVariants);
    setEditedProduct(prev => ({ 
      ...prev, 
      variants: newVariants,
      quantity: newTotalQuantity
    }));
  };

  const handleRemoveVariant = (index) => {
    const newVariants = [...editedProduct.variants];
    newVariants.splice(index, 1);
    const newTotalQuantity = calculateTotalQuantity(newVariants);
    setEditedProduct(prev => ({ 
      ...prev, 
      variants: newVariants,
      quantity: newTotalQuantity
    }));
  };

  const handleSave = () => {
    const formData = new FormData();
    Object.keys(editedProduct).forEach(key => {
      if (key === 'variants') {
        formData.append('variants', JSON.stringify(editedProduct.variants.map(variant => ({
          ...variant,
          imageUrl: variant.imageUrl instanceof File ? '' : variant.imageUrl
        }))));
        editedProduct.variants.forEach((variant, index) => {
          if (variant.imageUrl instanceof File) {
            formData.append(`images${index}`, variant.imageUrl);
          }
        });
      } else if (key === 'category') {
        formData.append('category', JSON.stringify(editedProduct.category));
      } else {
        formData.append(key, editedProduct[key]);
      }
    });
    onSave(formData);
  };

  if (!editedProduct) return null;

  return (
    <ThemeProvider theme={theme}>
      <CustomDialog open={open} onClose={onClose} fullWidth maxWidth={false}>
        <Paper elevation={3} sx={{ backgroundColor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" color="primary">Chỉnh sửa sản phẩm</Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Box sx={{ padding: 2 }}>
              <TextField fullWidth margin="normal" label="Tiêu đề" name="title" value={editedProduct.title} onChange={handleInputChange} variant="outlined" />
              <TextField fullWidth margin="normal" label="Mô tả" name="description" multiline rows={4} value={editedProduct.description} onChange={handleInputChange} variant="outlined" />
              <TextField fullWidth margin="normal" label="Thương hiệu" name="brand" value={editedProduct.brand} onChange={handleInputChange} variant="outlined" />
              
              {/* Grid cho các trường danh mục */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Danh mục cấp 1" 
                    name="category.topLevelCategory" 
                    value={editedProduct.category.topLevelCategory} 
                    onChange={handleInputChange} 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Danh mục cấp 2" 
                    name="category.secondLevelCategory" 
                    value={editedProduct.category.secondLevelCategory} 
                    onChange={handleInputChange} 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Danh mục cấp 3" 
                    name="category.thirdLevelCategory" 
                    value={editedProduct.category.thirdLevelCategory} 
                    onChange={handleInputChange} 
                    variant="outlined" 
                  />
                </Grid>
              </Grid>

              {/* Grid cho các trường giá */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth
                    label="Giá" 
                    name="price" 
                    type="number" 
                    value={editedProduct.price} 
                    onChange={handleInputChange} 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth
                    label="Phần trăm giảm giá" 
                    name="discountedPersent" 
                    type="number" 
                    value={editedProduct.discountedPersent} 
                    onChange={handleInputChange} 
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth
                    label="Giá sau giảm" 
                    name="discountedPrice" 
                    type="number" 
                    value={editedProduct.discountedPrice} 
                    disabled 
                    variant="outlined" 
                  />
                </Grid>
              </Grid>

              {/* Phần còn lại của form */}
              <Box mt={3} display="flex" alignItems="center">
                <TextField
                  label="Tên màu"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  style={{ width: '50px', height: '50px', padding: 0, border: 'none' }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAddVariant}
                  startIcon={<AddIcon />}
                  disabled={!colorName}
                  sx={{ ml: 1 }}
                >
                  Thêm màu
                </Button>
              </Box>
              
              {editedProduct.variants.map((variant, variantIndex) => (
                <Box key={variantIndex} mt={2} p={2} border={1} borderRadius={2} borderColor="primary.light">
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle1" sx={{ mr: 2 }}>Tên màu: {variant.nameColor}</Typography>
                      <Box 
                        sx={{ 
                          width: '30px', 
                          height: '30px', 
                          backgroundColor: variant.color,
                          border: '1px solid #000',
                          mr: 2
                        }}
                      />
                      <Typography variant="subtitle1">Mã màu: {variant.color}</Typography>
                    </Box>
                    <IconButton onClick={() => handleRemoveVariant(variantIndex)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Box mt={2}>
                    <Typography sx={{mb:2}} variant="subtitle1">Kích thước và số lượng:</Typography>
                    {variant.sizes.map((size, sizeIndex) => (
                      <Box key={sizeIndex} display="flex" alignItems="center" mb={1}>
                        <Typography variant="body1" sx={{ mr: 2, minWidth: '30px' }}>{size.size}</Typography>
                        <TextField
                          label="Số lượng"
                          type="number"
                          value={size.quantityItem}
                          onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'quantityItem', e.target.value)}
                          variant="outlined"
                          sx={{ mr: 2, width: '100px' }}
                        />
                        <IconButton onClick={() => handleRemoveSize(variantIndex, sizeIndex)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    
                    <Box display="flex" alignItems="center" mt={2}>
                      <FormControl sx={{ mr: 3, minWidth: 200 }}>
                        <InputLabel>Kích thước</InputLabel>
                        <Select
                          value={variantInputs[variantIndex]?.selectedSize || ''}
                          onChange={(e) => handleVariantInputChange(variantIndex, 'selectedSize', e.target.value)}
                          label="Kích thước"
                        >
                          <MenuItem value="S">S</MenuItem>
                          <MenuItem value="M">M</MenuItem>
                          <MenuItem value="L">L</MenuItem>
                          <MenuItem value="XL">XL</MenuItem>
                          <MenuItem value="XXL">XXL</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Số lượng"
                        type="number"
                        value={variantInputs[variantIndex]?.selectedQuantity || ''}
                        onChange={(e) => handleVariantInputChange(variantIndex, 'selectedQuantity', e.target.value)}
                        variant="outlined"
                        sx={{ mr: 3, width: '150px' }}
                      />
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleAddSize(variantIndex)}
                        startIcon={<AddIcon />}
                        disabled={!variantInputs[variantIndex]?.selectedSize || !variantInputs[variantIndex]?.selectedQuantity}
                      >
                        Thêm kích thước
                      </Button>
                    </Box>
                  </Box>
                  <Box mt={2} display="flex" alignItems="center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVariantChange(variantIndex, 'imageUrl', e.target.files[0])}
                      style={{ display: 'none' }}
                      id={`variant-image-${variantIndex}`}
                    />
                    {(variant.imagePreview || variant.imageUrl) && (
                      <Box width={50} height={50} overflow="hidden" borderRadius={1}>
                        <img 
                          src={variant.imagePreview || variant.imageUrl} 
                          alt={`Variant ${variantIndex}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </Box>
                    )}
                    <label className='ml-5' htmlFor={`variant-image-${variantIndex}`}>
                      <Button variant="contained" component="span">
                        Tải ảnh lên
                      </Button>
                    </label>
                  </Box>
                </Box>
              ))}
              
              <Box display="flex" gap={2}>
                <TextField
                  margin="normal"
                  label="Tổng số lượng"
                  name="quantity"
                  type="number"
                  value={editedProduct.quantity}
                  disabled
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
                
                <TextField
                  margin="normal"
                  label="Đã bán"
                  name="sellQuantity"
                  type="number"
                  value={editedProduct.sellQuantity}
                  disabled
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: 2, backgroundColor: 'background.paper' }}>
            <Button onClick={onClose} color="secondary">Hủy</Button>
            <Button onClick={handleSave} variant="contained" color="primary">Lưu thay đổi</Button>
          </DialogActions>
        </Paper>
      </CustomDialog>
    </ThemeProvider>
  );
};

export default EditProductDialog;
