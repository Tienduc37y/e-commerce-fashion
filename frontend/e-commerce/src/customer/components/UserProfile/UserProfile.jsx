import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changePasswordSchema } from '../../../utils/yupValidation';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../../redux/Auth/Action';

export default function PasswordChangePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {auth} = useSelector(store => store)
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if(!accessToken) {
      navigate('/login')
    }
  },[navigate])

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
      if (value !== formData.newPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      try {
        await changePasswordSchema.validateAt(name, { [name]: value });
        setErrors(prev => ({ ...prev, [name]: '' }));
        if (name === 'newPassword' && confirmPassword) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePasswordSchema.validate(formData, { abortEarly: false });
      if (formData.newPassword !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
        return;
      }
      setErrors({});
      
      await dispatch(changePassword(formData))
      toast.success('Đổi mật khẩu thành công', {
        autoClose: 1000,
      });
      setFormData({
        oldPassword: '',
        newPassword: '',
      });
      setConfirmPassword('');
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((validationError) => {
          validationErrors[validationError.path] = validationError.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.message,{
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <ToastContainer />
      <p className="text-center text-3xl font-bold mb-4">Đổi mật khẩu</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mật khẩu hiện tại"
              name="oldPassword"
              type="password"
              variant="outlined"
              value={formData.oldPassword}
              onChange={handleChange}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              variant="outlined"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Thay đổi mật khẩu
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
