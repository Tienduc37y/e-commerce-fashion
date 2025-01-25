import axios from "axios";
import { store } from "../redux/store";
import { refreshTokenAuth } from "../redux/Auth/Action";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
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

let isRefreshToken = false;
let requestsToRefresh = [];

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response, config } = error;
        const status = response?.status;

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            localStorage.clear()
            return Promise.reject(error);
        }
        if (status === 403 && !config._retry) {
            if (!isRefreshToken) {
                isRefreshToken = true;
                config._retry = true;
                try {
                    const res = await store.dispatch(refreshTokenAuth(refreshToken));
                    if (res) {
                      localStorage.setItem('accessToken', res.tokens.access.token);
                    }
                } catch (refreshError) {
                    localStorage.clear()
                    requestsToRefresh.forEach((callback) => callback(null));
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshToken = false;
                    requestsToRefresh = [];
                }

                return new Promise((resolve, reject) => {
                    requestsToRefresh.push((token) => {
                        if (token) {
                            config.headers['Authorization'] = `Bearer ${token}`;
                            resolve(axiosInstance(config));
                        } else {
                            reject(error);
                        }
                    });
                });
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
