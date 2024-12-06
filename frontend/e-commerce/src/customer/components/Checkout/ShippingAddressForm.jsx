import React, { useState, useEffect } from 'react';
import { Grid, TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useCities, useDistricts, useWards } from '../../../common/handleCity';

const ShippingAddressForm = ({ onShippingInfoChange, initialAddress }) => {
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    city: '',
    district: '',
    ward: '',
    streetAddress: ''
  });

  const [errors, setErrors] = useState({});
  const { cities, selectedCityId, handleCityChange, setSelectedCityId } = useCities();
  const { districts, selectedDistrictId, handleDistrictChange, setSelectedDistrictId } = useDistricts(selectedCityId);
  const { wards } = useWards(selectedDistrictId);

  // Set initial data và xử lý city
  useEffect(() => {
    if (initialAddress && cities.length > 0) {
      setShippingInfo({
        firstName: initialAddress.firstName || '',
        lastName: initialAddress.lastName || '',
        mobile: initialAddress.mobile || '',
        city: initialAddress.city || '',
        district: initialAddress.district || '',
        ward: initialAddress.ward || '',
        streetAddress: initialAddress.streetAddress || ''
      });

      // Tìm và set city ID
      const cityFound = cities.find(city => city.province_name === initialAddress.city);
      if (cityFound) {
        setSelectedCityId(cityFound.province_id);
      }
    }
  }, [initialAddress, cities, setSelectedCityId]);

  // Xử lý district khi có districts data
  useEffect(() => {
    if (initialAddress?.district && districts.length > 0) {
      const districtFound = districts.find(d => d.district_name === initialAddress.district);
      if (districtFound) {
        setSelectedDistrictId(districtFound.district_id);
      }
    }
  }, [initialAddress?.district, districts, setSelectedDistrictId]);

  const handleCitySelect = (e) => {
    const cityName = e.target.value;
    setShippingInfo(prev => ({ ...prev, city: cityName, district: '', ward: '' }));
    handleCityChange(e);
  };

  const handleDistrictSelect = (e) => {
    const districtName = e.target.value;
    setShippingInfo(prev => ({ ...prev, district: districtName, ward: '' }));
    handleDistrictChange(e);
  };

  const handleWardSelect = (e) => {
    const wardName = e.target.value;
    setShippingInfo(prev => ({ ...prev, ward: wardName }));
  };

  // Thông báo thay đổi cho component cha
  useEffect(() => {
    onShippingInfoChange(shippingInfo);
  }, [shippingInfo, onShippingInfoChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ 
      border: '1px solid #e0e0e0', 
      borderRadius: 2, 
      p: 3,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      width: '100%'
    }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <MyLocationIcon sx={{ mr: 1 }} />
        Thông tin giao hàng
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="firstName"
            name="firstName"
            label="Họ"
            variant="outlined"
            size="small"
            value={shippingInfo.firstName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
              required
              fullWidth
              id="lastName"
              name="lastName"
              label="Tên"
              variant="outlined"
              size="small"
              value={shippingInfo.lastName}
              onChange={handleInputChange}
            />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="mobile"
            name="mobile"
            label="Số điện thoại"
            variant="outlined"
            size="small"
            type="number"
            value={shippingInfo.mobile}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="city-label">Tỉnh / Thành phố</InputLabel>
            <Select
              labelId="city-label"
              id="city"
              name="city"
              value={shippingInfo.city}
              label="Tỉnh / Thành phố"
              onChange={handleCitySelect}
            >
              {cities.map((city) => (
                <MenuItem key={city.province_id} value={city.province_name}>
                  {city.province_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="district-label">Quận / Huyện</InputLabel>
            <Select
              labelId="district-label"
              id="district"
              name="district"
              value={shippingInfo.district}
              label="Quận / Huyện"
              onChange={handleDistrictSelect}
              disabled={!selectedCityId}
            >
              {districts.map((district) => (
                <MenuItem key={district.district_id} value={district.district_name}>
                  {district.district_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="ward-label">Phường / Xã</InputLabel>
            <Select
              labelId="ward-label"
              id="ward"
              name="ward"
              value={shippingInfo.ward}
              label="Phường / Xã"
              onChange={handleWardSelect}
              disabled={!selectedDistrictId}
            >
              {wards.map((ward) => (
                <MenuItem key={ward.ward_id} value={ward.ward_name}>
                  {ward.ward_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="streetAddress"
            name="streetAddress"
            label="Nhập địa chỉ"
            variant="outlined"
            size="small"
            multiline
            rows={4}
            value={shippingInfo.streetAddress}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShippingAddressForm;
