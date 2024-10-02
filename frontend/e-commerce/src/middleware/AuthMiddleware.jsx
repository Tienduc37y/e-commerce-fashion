import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/Auth/Action';

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
    return <div>Loading...</div>; // Hoặc một component loading khác
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