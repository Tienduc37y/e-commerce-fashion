import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordSchema, resetPasswordSchema } from '../../../utils/yupValidation';
import { getTokenResetPassword, resetPassword } from '../../../redux/Auth/Action';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', token: '' });
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(0);
  const [isResetMode, setIsResetMode] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) {
      navigate('/')
    }
  },[navigate])

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    try {
      if (isResetMode) {
        await resetPasswordSchema.validateAt(name, { [name]: value });
      } else {
        await forgotPasswordSchema.validateAt(name, { [name]: value });
      }
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    } catch (validationError) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: validationError.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isResetMode) {
        await resetPasswordSchema.validate(formData, { abortEarly: false });
        dispatch(resetPassword(formData));
        toast.success('Mật khẩu mới đã được gửi đến email của bạn', {
          onClose: () => navigate('/login'),
          autoClose: 1500,
        });
        setFormData({ email: '', token: '' });
        setIsResetMode(false);
      } else {
        await forgotPasswordSchema.validate(formData, { abortEarly: false });
        await handleGetToken();
        setIsResetMode(true);
      }
      setErrors({});
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((validationError) => {
          validationErrors[validationError.path] = validationError.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.message, {
          autoClose: 1500
        });
      }
    }
  };

  const handleGetToken = async () => {
    try {
      setTimer(60);
      await dispatch(getTokenResetPassword(formData.email));
      toast.success('Token đã được gửi thành công!', {
        autoClose: 1500
      });
    } catch (error) {
      setTimer(0)
      toast.error('Đã xảy ra lỗi khi gửi token.', {
        autoClose: 1500
      });
    }
  };

  return (
    <div className="flex w-full flex-wrap">
      <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
        <div className="flex justify-center pt-5 md:-mb-24 md:justify-start md:pl-12">
          <Link to="/" className="border-b-4 border-b-blue-700 pb-2 text-2xl font-bold text-gray-900">
            GIN STORE
          </Link>
        </div>
        <div className="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
          <p className="text-center text-3xl font-bold mb-4">Quên mật khẩu</p>
          <p variant="h5" className="text-gray-900 mb-4 text-center">
            {isResetMode ? "Nhập token đã được gửi đến email của bạn" : "Xin vui lòng nhập email đăng ký"}
          </p>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  className="rounded"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              {isResetMode && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Token"
                    name="token"
                    variant="outlined"
                    className="rounded"
                    value={formData.token}
                    onChange={handleChange}
                    error={!!errors.token}
                    helperText={errors.token}
                  />
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              variant="contained"
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              {isResetMode ? 'Đặt lại mật khẩu' : 'Gửi token'}
            </Button>
          </form>
          {!isResetMode && (
            <Button
              variant="contained"
              className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleGetToken}
              disabled={timer > 0}
            >
              {timer > 0 ? `Đợi ${timer}s` : 'Gửi lại token'}
            </Button>
          )}
        </div>
      </div>
      <div className="pointer-events-none hidden select-none bg-black shadow-2xl md:block md:w-1/2 lg:w-2/3">
        <img
          className="h-screen w-full object-cover opacity-90"
          src="https://lh3.googleusercontent.com/xCbtOb-ykOYKEsyushxdbP5OvPJvoScZ662f3OA8fqWdn_-0BjFE32dOR1Pez8ZDr5DVT524nQe4UePefYNgu1_RPemm72BuIac4Ti1EwgCT7b3-YOmmupBKhu1F7UPScNMmxg2KKQ=w1200-h800-no"
          alt="Ảnh shop quần áo"
        />
      </div>
      <ToastContainer />
    </div>
  );
}