import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/Auth/Action';
import { CircularProgress, Backdrop, Typography } from '@mui/material';

const AuthMiddleware = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await dispatch(getUser(token));
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, [dispatch]);

  if (isLoading) {
    return (
      <Backdrop
        open={true}
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <CircularProgress 
            size={60}
            thickness={4} 
            sx={{ 
              color: '#3B82F6' // Tailwind blue-500
            }} 
          />
          <Typography 
            variant="h6" 
            className="text-blue-500 font-medium animate-pulse"
          >
            Đang tải...
          </Typography>
        </div>
      </Backdrop>
    );
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  if (auth.user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthMiddleware;
