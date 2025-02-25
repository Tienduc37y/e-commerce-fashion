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
          autoClose: 1000,
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
          autoClose: 1000
        });
      }
    }
  };

  const handleGetToken = async () => {
    try {
      setTimer(60);
      await dispatch(getTokenResetPassword(formData.email));
      toast.success('Token đã được gửi thành công!', {
        autoClose: 1000
      });
    } catch (error) {
      setTimer(0)
      toast.error('Đã xảy ra lỗi khi gửi token.', {
        autoClose: 1000
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
          <p variant="h5" className="text-gray-900 mb-8 text-center">
            {isResetMode ? "Nhập token đã được gửi đến email của bạn" : "Xin vui lòng nhập email đăng ký"}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              className="rounded-lg"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
            {isResetMode && (
              <>
                <TextField
                  fullWidth
                  label="Token"
                  name="token"
                  variant="outlined"
                  className="rounded-lg"
                  value={formData.token}
                  onChange={handleChange}
                  error={!!errors.token}
                  helperText={errors.token}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleGetToken}
                  disabled={timer > 0}
                  className="w-full py-3 text-base font-semibold rounded-lg"
                  sx={{
                    borderColor: timer > 0 ? 'rgba(0, 0, 0, 0.12)' : '#1976d2',
                    color: timer > 0 ? 'rgba(0, 0, 0, 0.26)' : '#1976d2',
                    '&:hover': {
                      borderColor: '#1565c0',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  {timer > 0 ? `Gửi lại token sau ${timer}s` : 'Gửi lại token'}
                </Button>
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              className="w-full py-3 text-base font-semibold rounded-lg"
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              {isResetMode ? 'Đặt lại mật khẩu' : 'Gửi token'}
            </Button>
          </form>
        </div>
      </div>
      <div className="pointer-events-none hidden select-none bg-black shadow-2xl md:block md:w-1/2 lg:w-2/3">
        <img
          className="h-screen w-full object-cover opacity-90"
          src="./bg.jpg"
          alt="Ảnh shop quần áo"
        />
      </div>
      <ToastContainer />
    </div>
  );
}