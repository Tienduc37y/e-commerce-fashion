import React, { useEffect, useState } from 'react';
import { Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginSchema } from '../../../utils/yupValidation';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/Auth/Action';
import { toast, ToastContainer } from 'react-toastify';
import { getAccessToken } from '../../../utils/authFunction';


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) {
      navigate('/')
    }
  },[navigate])
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    try {
      await loginSchema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    } catch (validationError) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: validationError.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
    
      const role = await dispatch(login(formData));
      toast.success('Đăng nhập thành công', {
        onClose: () => {
          if(role === "ADMIN"){
            return navigate("/admin")
          }
          else {
            return navigate("/")
          }
        },
        autoClose: 1500,
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
          autoClose:1500
        });
      }
    }
  };
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex w-full flex-wrap">
      <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
        <div className="flex justify-center pt-5 md:-mb-24 md:justify-start md:pl-12">
          <Link to="/" className="border-b-4 border-b-blue-700 pb-2 text-2xl font-bold text-gray-900">GIN STORE</Link>
        </div>
        <div className="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
          <p className="text-center text-3xl font-bold mb-4">Đăng nhập</p>
          <p className="text-gray-900 mb-4 text-center">Xin vui lòng đăng nhập để mua sắm</p>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
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
            <Link to="/forgot-password" className='text-blue-400 flex justify-end'>Quên mật khẩu ?</Link>
            <Button
              type="submit"
              variant="contained"
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Đăng nhập
            </Button>
          </form>
          <div className="pt-12 pb-12 text-center">
            <p className="whitespace-nowrap">
              Bạn chưa có tài khoản?
              <Link to="/register" className="font-semibold underline text-blue-400">Đăng ký</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none hidden select-none bg-black shadow-2xl md:block md:w-1/2 lg:w-2/3">
        <img
          className="h-screen w-full object-cover opacity-90"
          src="https://lh3.googleusercontent.com/xCbtOb-ykOYKEsyushxdbP5OvPJvoScZ662f3OA8fqWdn_-0BjFE32dOR1Pez8ZDr5DVT524nQe4UePefYNgu1_RPemm72BuIac4Ti1EwgCT7b3-YOmmupBKhu1F7UPScNMmxg2KKQ=w1200-h800-no"
          alt="Ảnh shop quần áo"
        />
      </div>
      <ToastContainer/>
    </div>
  );
}
