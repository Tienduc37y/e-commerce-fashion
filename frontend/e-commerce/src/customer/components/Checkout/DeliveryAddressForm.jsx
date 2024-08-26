import React, { useState } from 'react';
import { Button, Grid, TextField, Box, MenuItem } from '@mui/material';
import AddressCard from '../AddressCard/AddressCard';
import { useCities, useDistricts, useWards } from '../../../common/handleCity';

const DeliveryAddressForm = () => {
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');

  const { cities, selectedCityId, handleCityChange } = useCities();
  const { districts, selectedDistrictId, handleDistrictChange } = useDistricts(selectedCityId);
  const { wards } = useWards(selectedDistrictId);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const shipInfo = {
      name: data.get('name'),
      number: data.get('number'),
      city: data.get('city'),
      district: data.get('district'),
      ward: data.get('ward'),
      address: data.get('address')
    };
    console.log(shipInfo);
  };

  return (
    <div className="px-4 md:px-10 lg:px-20 py-6">
      <Grid container spacing={4}>
        <Grid item xs={12} lg={5} className="border rounded-e-md shadow-md h-[31rem] overflow-y-scroll">
          <div className="p-5 py-7 border-b cursor-pointer">
            <AddressCard />
            <Button sx={{ mt: 2 }} size="large" variant="contained">
              Vận chuyển
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Box className="border rounded-s-md shadow-md p-5">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="name"
                    name="name"
                    label="Tên"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="number"
                    name="number"
                    label="Số điện thoại"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="Thành phố"
                    value={city}
                    name="city"
                    onChange={(e) => setCity(handleCityChange(e))}
                    variant="outlined"
                    fullWidth
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.province_id} value={city.province_name}>
                        {city.province_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="Huyện"
                    value={district}
                    name="district"
                    onChange={(e) => setDistrict(handleDistrictChange(e))}
                    variant="outlined"
                    fullWidth
                    disabled={!selectedCityId}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district.district_id} value={district.district_name}>
                        {district.district_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="Phường"
                    value={ward}
                    name="ward"
                    onChange={(e) => setWard(e.target.value)}
                    variant="outlined"
                    fullWidth
                    disabled={!selectedDistrictId}
                  >
                    {wards.map((ward) => (
                      <MenuItem key={ward.ward_id} value={ward.ward_name}>
                        {ward.ward_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="address"
                    name="address"
                    label="Địa Chỉ"
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-start" className="mt-4">
                <Grid item>
                  <Button type="submit" size="large" variant="contained">
                    Vận chuyển
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default DeliveryAddressForm;
