import axios from "axios";
import { setAccessToken, setRefreshToken, setRole } from "../utils/authFunction";
import { store } from "../redux/store";
import { refreshTokenAuth } from "../redux/Auth/Action";


const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000',
  baseURL: 'https://e-commerce-fashion-eosin.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return Promise.reject(error);
  }

  if (error.response.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;  

    try {

      const res = await store.dispatch(refreshTokenAuth(refreshToken)); 
      if(res) {
        setAccessToken(res?.tokens?.access?.token);
        setRefreshToken(refreshToken);
        setRole(res?.role)
      }
      else {
        throw new Error(response?.error)
      }

      originalRequest.headers['Authorization'] = `Bearer ${res?.tokens?.access?.token}`;
      return axiosInstance(originalRequest); 
    } catch (refreshError) {
      console.error('Error refreshing token:', refreshError);
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
});

export default axiosInstance;
