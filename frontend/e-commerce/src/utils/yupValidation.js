import { object, string, ref } from "yup";
export const loginSchema = object().shape({
    username: string().required('Tên đăng nhập không được để trống'),
    password: string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  });
export const registerSchema = object().shape({
  firstName: string().required('Tên không được để trống'),
  lastName: string().required('Họ không được để trống'),
  username: string().min(6, 'Tên đăng nhập phải có ít nhất 6 ký tự').required('Tên đăng nhập là bắt buộc'),
  email: string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Mật khẩu phải chứa ít nhất một chữ cái và một số')
    .required('Mật khẩu là bắt buộc'),
  mobile: string()
    .matches(/^[0-9]{10,12}$/, 'Số điện thoại phải có từ 10 đến 12 chữ số')
    .required('Số điện thoại là bắt buộc')
});

export const forgotPasswordSchema = object().shape({
  email: string().email('Email không hợp lệ').required('Email là bắt buộc')
});

export const resetPasswordSchema = object().shape({
  email: string().email('Email không hợp lệ').required('Email là bắt buộc'),
  token: string().required('Token là bắt buộc')
});

export const changePasswordSchema = object().shape({
  oldPassword: string().required('Mật khẩu cũ là bắt buộc'),
  newPassword: string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Mật khẩu mới phải chứa ít nhất một chữ cái và một số')
    .required('Mật khẩu mới là bắt buộc')
});

export const editUserSchema = object().shape({
  firstName: string().required('Tên không được để trống'),
  lastName: string().required('Họ không được để trống'),
  email: string().email('Email không hợp lệ').required('Email là bắt buộc'),
  mobile: string()
    .matches(/^[0-9]{10,12}$/, 'Số điện thoại phải có từ 10 đến 12 chữ số')
    .required('Số điện thoại là bắt buộc'),
  role: string().required('Quyền truy cập là bắt buộc')
});