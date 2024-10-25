import React, { useState } from 'react';
import {
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
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../redux/Product/Action';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import {theme} from '../theme/theme';

const AddProductDialog = ({ onClose, onProductCreated }) => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    discountedPrice: '',
    discountedPersent: '',
    brand: '',
    quantity: 0,
    category: {
      topLevelCategory: '',
      secondLevelCategory: '',
      thirdLevelCategory: '',
    },
    variants: [],
  });

  const [selectedColor, setSelectedColor] = useState('#000000');
  const [colorName, setColorName] = useState('');
  const [variantInputs, setVariantInputs] = useState([]);

  const calculateTotalQuantity = (variants) => {
    return variants.reduce((total, variant) => 
      total + variant.sizes.reduce((sizeTotal, size) => sizeTotal + Number(size.quantityItem), 0), 0
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['topLevelCategory', 'secondLevelCategory', 'thirdLevelCategory'].includes(name)) {
      setProductData(prev => ({
        ...prev,
        category: {
          ...prev.category,
          [name]: value
        }
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'price' || name === 'discountedPersent' ? {
          discountedPrice: name === 'price' ? 
            value * (1 - productData.discountedPersent / 100) : 
            productData.price * (1 - value / 100)
        } : {})
      }));
    }
  };

  const handleAddVariant = () => {
    if (colorName && !productData.variants.some(v => v.nameColor === colorName)) {
      setProductData(prev => ({
        ...prev,
        variants: [...prev.variants, { nameColor: colorName, color: selectedColor, imageUrl: null, sizes: [] }],
        quantity: calculateTotalQuantity([...prev.variants, { sizes: [] }])
      }));
      setVariantInputs(prev => [...prev, { selectedSize: '', selectedQuantity: '' }]);
      setSelectedColor('#000000');
      setColorName('');
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...productData.variants];
    newVariants[index][field] = value;
    if (field === 'imageUrl' && value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newVariants[index].imagePreview = e.target.result;
        setProductData(prev => ({ ...prev, variants: newVariants }));
      };
      reader.readAsDataURL(value);
    } else {
      setProductData(prev => ({ ...prev, variants: newVariants }));
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

  const handleAddSize = (variantIndex) => {
    const { selectedSize, selectedQuantity } = variantInputs[variantIndex] || {};
    if (selectedSize && selectedQuantity && !productData.variants[variantIndex].sizes.some(s => s.size === selectedSize)) {
      const newVariants = [...productData.variants];
      newVariants[variantIndex].sizes.push({ size: selectedSize, quantityItem: Number(selectedQuantity) });
      setProductData(prev => ({ 
        ...prev, 
        variants: newVariants,
        quantity: calculateTotalQuantity(newVariants)
      }));
      handleVariantInputChange(variantIndex, 'selectedSize', '');
      handleVariantInputChange(variantIndex, 'selectedQuantity', '');
    }
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    const newVariants = [...productData.variants];
    newVariants[variantIndex].sizes[sizeIndex][field] = value;
    setProductData(prev => ({ 
      ...prev, 
      variants: newVariants,
      quantity: calculateTotalQuantity(newVariants)
    }));
  };

  const handleRemoveSize = (variantIndex, sizeIndex) => {
    const newVariants = [...productData.variants];
    newVariants[variantIndex].sizes.splice(sizeIndex, 1);
    setProductData(prev => ({ 
      ...prev, 
      variants: newVariants,
      quantity: calculateTotalQuantity(newVariants)
    }));
  };

  const handleRemoveVariant = (index) => {
    const newVariants = [...productData.variants];
    newVariants.splice(index, 1);
    setProductData(prev => ({ 
      ...prev, 
      variants: newVariants,
      quantity: calculateTotalQuantity(newVariants)
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'variants') {
        formData.append('variants', JSON.stringify(productData.variants.map(variant => ({
          ...variant,
          imageUrl: '' // Đặt lại imageUrl để tránh gửi đối tượng File
        }))));
        productData.variants.forEach((variant, index) => {
          if (variant.imageUrl instanceof File) {
            formData.append(`images`, variant.imageUrl);
          }
        });
      } else if (key === 'category') {
        formData.append('category', JSON.stringify(productData.category));
      } else {
        formData.append(key, productData[key]);
      }
    });

    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.log(productData.variants)
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
      <Paper elevation={3} sx={{ backgroundColor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" color="primary">Thêm mới sản phẩm</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Box sx={{ padding: 2 }}>
            <TextField fullWidth margin="normal" label="Tiêu đề" name="title" value={productData.title} onChange={handleInputChange} variant="outlined" />
            <TextField fullWidth margin="normal" label="Mô tả" name="description" multiline rows={4} value={productData.description} onChange={handleInputChange} variant="outlined" />
            <TextField fullWidth margin="normal" label="Thương hiệu" name="brand" value={productData.brand} onChange={handleInputChange} variant="outlined" />
            
            {/* Grid cho các trường danh mục */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth 
                  label="Danh mục cấp 1" 
                  name="topLevelCategory" 
                  value={productData.category.topLevelCategory} 
                  onChange={handleInputChange} 
                  variant="outlined" 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth 
                  label="Danh mục cấp 2" 
                  name="secondLevelCategory" 
                  value={productData.category.secondLevelCategory} 
                  onChange={handleInputChange} 
                  variant="outlined" 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth 
                  label="Danh mục cấp 3" 
                  name="thirdLevelCategory" 
                  value={productData.category.thirdLevelCategory} 
                  onChange={handleInputChange} 
                  variant="outlined" 
                />
              </Grid>
            </Grid>

            {/* Grid mới cho các trường giá */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth
                  label="Giá" 
                  name="price" 
                  type="number" 
                  value={productData.price} 
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
                  value={productData.discountedPersent} 
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
                  value={productData.discountedPrice} 
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
            
            {productData.variants.map((variant, variantIndex) => (
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
                  {variant.imagePreview && (
                    <Box width={50} height={50} overflow="hidden" borderRadius={1}>
                      <img 
                        src={variant.imagePreview} 
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
            
            <TextField
              margin="normal"
              label="Tổng số lượng"
              name="quantity"
              type="number"
              value={productData.quantity}
              disabled
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2, backgroundColor: 'background.paper' }}>
          <Button onClick={onClose} color="secondary">Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Tạo sản phẩm</Button>
        </DialogActions>
      </Paper>
    </ThemeProvider>
  );
};

export default AddProductDialog;
