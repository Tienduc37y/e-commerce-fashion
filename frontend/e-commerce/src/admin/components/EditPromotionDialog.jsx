import React, { useState, useEffect } from 'react';
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

const EditPromotionDialog = ({ open, onClose, promotion, onSave }) => {
  const [editedPromotion, setEditedPromotion] = useState(promotion);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditedPromotion(promotion);
    setErrors({});
  }, [promotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPromotion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(editedPromotion);
      onClose();
    } catch (error) {
      console.log(error)
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
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" color="primary">Chỉnh sửa mã giảm giá</Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Box sx={{ padding: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Mã giảm giá"
                name="code"
                value={editedPromotion?.code || ""}
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
                value={editedPromotion?.discountPercentage || ""}
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
                value={editedPromotion?.minOrderValue || ""}
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
                value={editedPromotion?.description || ""}
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
                value={editedPromotion?.endDate ? editedPromotion.endDate.slice(0, 16) : ""}
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
              Hủy bỏ
            </Button>
            <Button 
              onClick={handleSave}
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

export default EditPromotionDialog; 