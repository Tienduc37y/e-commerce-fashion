import React, { useState, useEffect } from 'react';
import { 
  Button, TextField, Grid, Box, Typography, Tabs, Tab, Paper,
  Avatar, Divider, styled 
} from '@mui/material';
import { Person, LocationOn, Lock } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, updateAddress } from '../../../redux/Auth/Action';
import { updateUser } from '../../../redux/AllUsers/Action';
import ShippingAddressForm from '../Checkout/ShippingAddressForm';
import { changePasswordSchema, editUserSchema } from '../../../utils/yupValidation';

// Styled Components
const StyledComponents = {
  Tabs: styled(Tabs)(({ theme }) => ({
    borderRight: `1px solid ${theme.palette.divider}`,
    '& .MuiTab-root': {
      minWidth: 160,
      textAlign: 'left',
      alignItems: 'flex-start',
      padding: '12px 24px',
    },
    '& .MuiTab-wrapper': {
      alignItems: 'flex-start',
    }
  })),

  Tab: styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
      backgroundColor: 'rgba(145, 85, 253, 0.1)',
      color: '#9155FD',
    },
    '&:hover': {
      backgroundColor: 'rgba(145, 85, 253, 0.04)',
    }
  })),

  ContentWrapper: styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    height: '100%',
  })),

  ProfileAvatar: styled(Avatar)(({ theme }) => ({
    width: 100,
    height: 100,
    margin: '0 auto 20px',
    backgroundColor: '#9155FD',
  })),

  Container: styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
    }
  }))
};

// Common Styles
const commonStyles = {
  textField: {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#9155FD',
      },
      '&.Mui-disabled': {
        backgroundColor: '#f5f5f5',
      },
    }
  },
  button: {
    bgcolor: '#9155FD',
    '&:hover': {
      bgcolor: '#804BDF',
    },
    mt: 2
  },
  formContainer: {
    width: '100%',
    '& .MuiGrid-item': {
      width: '100%'
    }
  }
};

// TabPanel Component
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const [tabValue, setTabValue] = useState(0);
  
  const [userData, setUserData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    mobile: '',
    role: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addressInfo, setAddressInfo] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    city: '',
    district: '',
    ward: '',
    streetAddress: ''
  });

  const [errors, setErrors] = useState({});

  // Handlers
  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    try {
      if (name === 'confirmPassword') {
        setErrors(prev => ({
          ...prev,
          confirmPassword: value !== passwordData.newPassword ? 'Mật khẩu xác nhận không khớp' : ''
        }));
      } else {
        changePasswordSchema.validateAt(name, { [name]: value });
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, [name]: error.message }));
    }
  };

  const handleSaveUserInfo = async () => {
    try {
      await editUserSchema.validate(userData, { abortEarly: false });
      await dispatch(updateUser(userData));
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      const validationErrors = {};
      error.inner?.forEach(err => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
      toast.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    try {
      await changePasswordSchema.validate(passwordData, { abortEarly: false });
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
        return;
      }
      await dispatch(changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }));
      toast.success('Đổi mật khẩu thành công', { autoClose: 1000 });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(error.message, { autoClose: 1000 });
      }
    }
  };

  const handleSaveAddress = async () => {
    try {
      await dispatch(updateAddress(auth.user._id, addressInfo));
      toast.success('Cập nhật địa chỉ thành công');
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật địa chỉ');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
  }, [navigate]);

  // Thêm useEffect để cập nhật userData khi auth thay đổi
  useEffect(() => {
    if (auth?.user) {
      setUserData({
        id: auth.user._id || '',
        firstName: auth.user.firstName || '',
        lastName: auth.user.lastName || '',
        username: auth.user.username || '',
        email: auth.user.email || '',
        mobile: auth.user.mobile || '',
        role: auth.user.role || '',
      });
    }
  }, [auth.user]); // Dependency là auth.user

  // Render methods
  const renderTextField = (props) => (
    <Grid item xs={12}>
      <TextField
        fullWidth
        {...props}
        error={!!errors[props.name]}
        helperText={errors[props.name]}
        sx={{
          ...commonStyles.textField,
          '& .MuiInputBase-root': {
            borderRadius: '8px',
          },
          '& .MuiOutlinedInput-input': {
            padding: '14px',
          }
        }}
      />
    </Grid>
  );

  const renderButton = (text, onClick) => (
    <Button
      variant="contained"
      onClick={onClick}
      sx={commonStyles.button}
    >
      {text}
    </Button>
  );

  return (
    <StyledComponents.Container>
      <Grid container spacing={3} sx={{ flexGrow: 1, height: '100%' }}>
        {/* Sidebar */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, mb: { xs: 2, md: 0 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <StyledComponents.ProfileAvatar>
                {auth?.user?.firstName?.charAt(0)}
              </StyledComponents.ProfileAvatar>
              <Typography variant="h6">
                {`${auth?.user?.firstName} ${auth?.user?.lastName}`}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {auth?.user?.email}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <StyledComponents.Tabs
              orientation="vertical"
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderRight: 1, borderColor: 'divider', flexGrow: 1 }}
            >
              <StyledComponents.Tab icon={<Person sx={{ mr: 1 }} />} label="Thông tin cá nhân" />
              <StyledComponents.Tab icon={<LocationOn sx={{ mr: 1 }} />} label="Địa chỉ" />
              <StyledComponents.Tab icon={<Lock sx={{ mr: 1 }} />} label="Đổi mật khẩu" />
            </StyledComponents.Tabs>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column' }}>
          <StyledComponents.ContentWrapper>
            {/* Personal Info Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h5" gutterBottom sx={{ mb: 4, color: '#9155FD' }}>
                Thông tin cá nhân
              </Typography>
              <Grid container spacing={3} sx={commonStyles.formContainer}>
                {renderTextField({ label: "ID", name: "id", value: userData.id, disabled: true })}
                {renderTextField({ label: "Username", name: "username", value: userData.username, disabled: true })}
                {renderTextField({ label: "Vai trò", name: "role", value: userData.role, disabled: true })}
                {renderTextField({ 
                  label: "Họ", 
                  name: "firstName", 
                  value: userData.firstName,
                  onChange: handleUserDataChange 
                })}
                {renderTextField({ 
                  label: "Tên", 
                  name: "lastName", 
                  value: userData.lastName,
                  onChange: handleUserDataChange 
                })}
                {renderTextField({ 
                  label: "Email", 
                  name: "email", 
                  value: userData.email,
                  onChange: handleUserDataChange 
                })}
                {renderTextField({ 
                  label: "Số điện thoại", 
                  name: "mobile", 
                  value: userData.mobile,
                  onChange: handleUserDataChange 
                })}
                <Grid item xs={12}>
                  {renderButton("Lưu thông tin", handleSaveUserInfo)}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Address Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h5" gutterBottom sx={{ mb: 4, color: '#9155FD' }}>
                Địa chỉ giao hàng
              </Typography>
              <ShippingAddressForm 
                onShippingInfoChange={setAddressInfo}
                initialAddress={auth?.user?.address}
              />
              {renderButton("Lưu địa chỉ", handleSaveAddress)}
            </TabPanel>

            {/* Password Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h5" gutterBottom sx={{ mb: 4, color: '#9155FD' }}>
                Đổi mật khẩu
              </Typography>
              <Grid container spacing={3} sx={commonStyles.formContainer}>
                {renderTextField({ 
                  label: "Mật khẩu hiện tại", 
                  name: "oldPassword", 
                  type: "password",
                  value: passwordData.oldPassword,
                  onChange: handlePasswordChange 
                })}
                {renderTextField({ 
                  label: "Mật khẩu mới", 
                  name: "newPassword", 
                  type: "password",
                  value: passwordData.newPassword,
                  onChange: handlePasswordChange 
                })}
                {renderTextField({ 
                  label: "Xác nhận mật khẩu mới", 
                  name: "confirmPassword", 
                  type: "password",
                  value: passwordData.confirmPassword,
                  onChange: handlePasswordChange 
                })}
                <Grid item xs={12}>
                  {renderButton("Đổi mật khẩu", handleSavePassword)}
                </Grid>
              </Grid>
            </TabPanel>
          </StyledComponents.ContentWrapper>
        </Grid>
      </Grid>
    </StyledComponents.Container>
  );
}
