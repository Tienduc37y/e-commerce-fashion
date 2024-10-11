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
  createTheme,
  Typography,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { editUserSchema } from '../../utils/yupValidation';
import { toast } from 'react-toastify';
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

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-root': {
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
  },
  '&:hover .MuiInputLabel-root': {
    color: theme.palette.primary.main,
  },
  '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));

const EditUserDialog = ({ open, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditedUser(user);
    setErrors({});
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    try {
      await editUserSchema.validate(editedUser, { abortEarly: false });
      const result = await onSave(editedUser);
      if (result && result.error) {
        toast.error(result.error);
      } else {
        // Không hiển thị toast ở đây, để component cha xử lý
        onClose();
      }
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      // Chỉ hiển thị toast nếu có lỗi validation
      if (Object.keys(newErrors).length > 0) {
        toast.error('Vui lòng kiểm tra lại thông tin nhập vào');
      }
    }
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
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
            <Typography variant="h5" color="primary">Chỉnh sửa Người dùng</Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ flexGrow: 1, overflow: 'auto', padding: 2 }}>
            <Box sx={{ padding: 2 }}>
              <CustomTextField
                fullWidth
                margin="normal"
                label="ID"
                name="id"
                value={editedUser?.id || ""}
                disabled
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <CustomTextField
                fullWidth
                margin="normal"
                label="Tên"
                name="firstName"
                value={editedUser?.firstName || ""}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <CustomTextField
                fullWidth
                margin="normal"
                label="Họ"
                name="lastName"
                value={editedUser?.lastName || ""}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <CustomTextField
                fullWidth
                margin="normal"
                label="Tên người dùng"
                name="username"
                value={editedUser?.username || ""}
                disabled
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <CustomTextField
                fullWidth
                margin="normal"
                label="Số điện thoại"
                name="mobile"
                value={editedUser?.mobile || ""}
                onChange={handleChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <CustomTextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={editedUser?.email || ""}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <CustomTextField
                fullWidth
                margin="normal"
                label="Quyền truy cập"
                name="role"
                value={editedUser?.role || ""}
                onChange={handleChange}
                error={!!errors.role}
                helperText={errors.role}
                variant="outlined"
                sx={{ mb: 2 }}
                disabled
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

export default EditUserDialog;