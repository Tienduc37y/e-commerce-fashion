import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  ThemeProvider,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {theme} from '../theme/theme';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  padding: '8px 16px',
  borderRadius: '4px',
  transition: 'all 0.3s',
}));

const ConfirmDeletePromotionDialog = ({ open, onClose, onConfirm, promotionCode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CustomDialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Paper elevation={3} sx={{ backgroundColor: 'background.paper' }}>
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h5" color="primary">
              Xác nhận xóa mã giảm giá
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ color: 'text.primary' }}>
              Bạn có chắc chắn muốn xóa mã giảm giá <strong className='text-red-500'>{promotionCode}</strong> không? Hành động này không thể hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: 2, backgroundColor: 'background.paper' }}>
            <CustomButton 
              onClick={onClose} 
              sx={{ 
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.common.white,
                },
              }}
            >
              Hủy
            </CustomButton>
            <CustomButton 
              onClick={onConfirm} 
              variant="contained"
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                boxShadow: '0 3px 5px 2px rgba(77, 171, 245, .3)',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: '0 6px 10px 4px rgba(77, 171, 245, .3)',
                },
              }}
              autoFocus
            >
              Xóa
            </CustomButton>
          </DialogActions>
        </Paper>
      </CustomDialog>
    </ThemeProvider>
  );
};

export default ConfirmDeletePromotionDialog; 