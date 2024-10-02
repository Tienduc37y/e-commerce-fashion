
import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { passwordChangeSchema } from '../../../utils/yupValidation';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../../redux/Auth/Action';


export default function PasswordChangePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {auth} = useSelector(store => store)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if(!accessToken) {
      navigate('/login')
    }
  },[navigate])
  console.log(auth)
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    try {
      await passwordChangeSchema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    } catch (validationError) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: validationError.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await passwordChangeSchema.validate(formData, { abortEarly: false });
      setErrors({});
      
      await dispatch(changePassword(formData))
      toast.success('Đổi mật khẩu thành công', {
        autoClose: 1000,
      });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
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
    <div className="p-6 max-w-lg mx-auto">
      <ToastContainer />
      <p className="text-center text-3xl font-bold mb-4">Đổi mật khẩu</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mật khẩu hiện tại"
              name="currentPassword"
              type="password"
              variant="outlined"
              value={formData.currentPassword}
              onChange={handleChange}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
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
              value={formData.confirmPassword}
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
