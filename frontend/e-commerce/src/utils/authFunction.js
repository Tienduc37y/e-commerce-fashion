import Cookies from 'js-cookie';
export const setAuthCookies = (tokens) => {
  if (tokens.access.token && tokens.refresh.token) {
    Cookies.set('accessToken', tokens.access.token, { expires: new Date(tokens.access.expiresAt) });
    Cookies.set('refreshToken', tokens.refresh.token, { expires: new Date(tokens.refresh.expiresAt) });
  }
};

export const getAccessToken = () => {
  return Cookies.get('accessToken')
}

export const getRefreshToken = () => {
  return Cookies.get('refreshToken')
}

export const clearAuthCookies = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

export const setAccessToken = (token) => {
  return localStorage.setItem('accessToken',token)
}
export const setRefreshToken = (token) => {
  return localStorage.setItem('refreshToken',token)
}

export const setRole = (role) => {
  return localStorage.setItem('role',role)
}

export const removeRole = () => {
  return localStorage.removeItem('role')
}

export const removeAccessToken = () => {
  return localStorage.removeItem('accessToken')
}

export const removeRefreshToken = () => {
  return localStorage.removeItem('refreshToken')
}