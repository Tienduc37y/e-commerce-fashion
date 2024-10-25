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