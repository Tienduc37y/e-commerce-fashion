import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  ThemeProvider,
  Typography,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { createPromotion } from '../../redux/Promotion/Action';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { theme } from '../theme/theme';

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

const AddPromotionDialog = ({ open, onClose, onPromotionCreated }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    minOrderValue: '',
    description: '',
    endDate: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (values) => {
    try {
        const result = await dispatch(createPromotion(values));
        if (result.success) {
            toast.success("Tạo mã giảm giá thành công!");
            onClose();
            if (onPromotionCreated) {
                onPromotionCreated();
            }
        } else {
            toast.error(result.error || "Tạo mã giảm giá thất bại!");
        }
    } catch (error) {
        toast.error(error.message || "Có lỗi xảy ra khi tạo mã giảm giá!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CustomDialog open={open} onClose={onClose} fullWidth maxWidth={false}>
        <Paper elevation={3} sx={{ 
          backgroundColor: 'background.paper', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <DialogTitle 
            component="div"
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h5" component="h1" color="primary">Thêm mã giảm giá mới</Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Box sx={{ padding: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Mã giảm giá"
                name="code"
                value={formData.code}
                onChange={handleChange}
                error={!!errors.code}
                helperText={errors.code}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phần trăm giảm giá"
                name="discountPercentage"
                type="number"
                value={formData.discountPercentage}
                onChange={handleChange}
                error={!!errors.discountPercentage}
                helperText={errors.discountPercentage}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Giá trị đơn hàng tối thiểu"
                name="minOrderValue"
                type="number"
                value={formData.minOrderValue}
                onChange={handleChange}
                error={!!errors.minOrderValue}
                helperText={errors.minOrderValue}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Mô tả"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Ngày hết hạn"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: 2, backgroundColor: 'background.paper' }}>
            <Button 
              onClick={onClose}
              sx={{ 
                fontWeight: 'bold',
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.common.white,
                },
              }}
            >
              Hủy
            </Button>
            <Button 
              onClick={() => handleSubmit(formData)}
              variant="contained"
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                boxShadow: '0 3px 5px 2px rgba(77, 171, 245, .3)',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
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

export default AddPromotionDialog; 