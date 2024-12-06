import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, InputAdornment, IconButton, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerSchema } from '../../../utils/yupValidation';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, register } from '../../../redux/Auth/Action';
import { toast, ToastContainer } from 'react-toastify';

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const accessToken = localStorage.getItem('accessToken')
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
  const {auth} = useSelector(store=>store)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) {
      navigate('/')
    }
  },[navigate])
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
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerSchema.validate(formData, { abortEarly: false });
      if (formData.password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
        return;
      }
      setErrors({});

      await dispatch(register(formData))
      toast.success('Đăng ký thành công', {
        onClose: () => navigate('/'),
        autoClose: 1000,
      });
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((validationError) => {
          validationErrors[validationError.path] = validationError.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.message,{
          autoClose:1000
        });
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div class="flex w-full flex-wrap">
      <div
        class="pointer-events-none hidden select-none bg-black shadow-2xl md:block md:w-1/2 lg:w-2/3"
      >
        <img
          class="h-screen w-full object-cover opacity-90"
          src="https://lh3.googleusercontent.com/xCbtOb-ykOYKEsyushxdbP5OvPJvoScZ662f3OA8fqWdn_-0BjFE32dOR1Pez8ZDr5DVT524nQe4UePefYNgu1_RPemm72BuIac4Ti1EwgCT7b3-YOmmupBKhu1F7UPScNMmxg2KKQ=w1200-h800-no"
          alt="Ảnh shop quần áo"
        />
      </div>
      <div class="flex w-full flex-col md:w-1/2 lg:w-1/3">
        <div class="flex justify-center pt-5 md:-mb-24 md:justify-start md:pl-12">
          <Link to="/" class="border-b-4 border-b-blue-700 pb-2 text-2xl font-bold text-gray-900">GIN STORE</Link>
        </div>
        <div class="flex flex-col justify-center mt-[2rem] md:mt-[7rem] px-6 pt-8 md:justify-start md:px-8 md:pt-0 lg:px-12">
          <p class="text-center text-3xl font-bold mb-5">Đăng ký</p>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            <Grid container spacing={2}> 
              <Grid item xs={12} sm={6}>
                <TextField
                fullWidth
                label="First Name"
                name="firstName"
                variant="outlined"
                className="rounded"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                variant="outlined"
                className="rounded"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  className='rounded'
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  className="rounded"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  variant="outlined"
                  className='rounded'
                  value={formData.mobile}
                  onChange={handleChange}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                />
              </Grid>
              <Grid item xs={12}>
                  <TextField
                  fullWidth
                  label="Mật khẩu"
                  variant="outlined"
                  className="rounded"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  variant="outlined"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Đăng ký
            </Button>
          </form>
          <div class="text-center text-blue-400 mt-5">
            <p class="whitespace-nowrap">
              <Link to="/login" class="font-semibold p-4">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}