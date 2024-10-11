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
  createTheme,
  Typography,
  Paper,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/Auth/Action';
import { toast } from 'react-toastify';
import { registerSchema } from '../../utils/yupValidation';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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

const AddUserDialog = ({ open, onClose, onUserCreated }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
      if (value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      try {
        await registerSchema.validateAt(name, { [name]: value });
        setErrors(prev => ({ ...prev, [name]: '' }));
        if (name === 'password' && confirmPassword) {
          if (value !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
          } else {
            setErrors(prev => ({ ...prev, confirmPassword: '' }));
          }
        }
      } catch (validationError) {
        setErrors(prev => ({ ...prev, [name]: validationError.message }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await registerSchema.validate(formData, { abortEarly: false });
      if (formData.password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
        return;
      }
      setErrors({});
      
      const result = await dispatch(register(formData, true));
      if (result.success) {
        toast.success('Tạo người dùng mới thành công');
        onUserCreated();
        onClose();
        // Do not navigate to home page
      } else {
        toast.error('Có lỗi xảy ra khi tạo người dùng mới');
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((validationError) => {
          validationErrors[validationError.path] = validationError.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.message);
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
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" color="primary">Thêm mới người dùng</Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Box sx={{ padding: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Họ"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Tên"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Tên đăng nhập"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Số điện thoại"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Mật khẩu"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
              Tạo người dùng
            </Button>
          </DialogActions>
        </Paper>
      </CustomDialog>
    </ThemeProvider>
  );
};

export default AddUserDialog;