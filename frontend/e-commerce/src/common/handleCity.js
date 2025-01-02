import { useState, useEffect } from 'react';

export const useCities = () => {
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://vapi.vnappmob.com/api/v2/province/');
        const data = await response.json();
        setCities(data.results);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleCityChange = (event) => {
    const selectedCity = cities.find(city => city.province_name === event.target.value);
    setSelectedCityId(selectedCity?.province_id || '');
    return event.target.value;
  };

  return { cities, selectedCityId, handleCityChange, setSelectedCityId };
};

export const useDistricts = (selectedCityId) => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('');

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedCityId) {
        try {
          const response = await fetch(`https://vapi.vnappmob.com/api/v2/province/district/${selectedCityId}`);
          const data = await response.json();
          setDistricts(data.results);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      }
    };

    fetchDistricts();
  }, [selectedCityId]);

  const handleDistrictChange = (event) => {
    const selectedDistrict = districts.find(district => district.district_name === event.target.value);
    setSelectedDistrictId(selectedDistrict?.district_id || '');
    return event.target.value;
  };

  return { districts, selectedDistrictId, handleDistrictChange, setSelectedDistrictId };
};

export const useWards = (selectedDistrictId) => {
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrictId) {
        try {
          const response = await fetch(`https://vapi.vnappmob.com/api/v2/province/ward/${selectedDistrictId}`);
          const data = await response.json();
          setWards(data.results);
        } catch (error) {
          console.error('Error fetching wards:', error);
        }
      }
    };

    fetchWards();
  }, [selectedDistrictId]);

  return { wards };
};
