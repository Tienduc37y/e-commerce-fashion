import { object, string, ref } from "yup";
export const loginSchema = object().shape({
    username: string().min(6, 'Username có ít nhất 6 ký tự').required('Vui lòng nhập username'),
    password: string().min(6, 'Mật khẩu có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
  });
export const registerSchema = object().shape({
  firstName: string().required('Vui lòng điền họ của bạn'),
  lastName: string().required('Vui lòng điền tên của bạn'),
  username: string().min(6, 'Username có ít nhất 6 ký tự').required('Vui lòng nhập username'),
  email: string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  mobile: string().matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ').required('Vui lòng nhập số điện thoại'),
  password: string().min(6, 'Mật khẩu có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
  confirmPassword:string().oneOf([ref('password'),null], 'Mật khẩu không trùng khớp').required('Vui lòng xác nhận lại mật khẩu'),
});

export const forgotPasswordSchema = object().shape({
  email: string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  token: string().max(6, 'Token có 6 kí tự').required('Vui lòng nhập token'),
});

export const passwordChangeSchema = object().shape({
  currentPassword: string().required('Mật khẩu có ít nhất 6 ký tự'),
  newPassword: string()
    .required('Mật khẩu mới không được bỏ trống')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: string()
    .oneOf([ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu không được bỏ trống')
});

export const editUserSchema = object().shape({
  mobile: string()
    .matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được quá 11 số')
    .required('Vui lòng nhập số điện thoại'),
  email: string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
});