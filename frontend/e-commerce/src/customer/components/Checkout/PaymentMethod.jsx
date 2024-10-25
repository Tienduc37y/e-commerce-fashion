import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio
} from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';

const PaymentMethod = ({ onPaymentMethodChange }) => {
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handlePaymentMethodChange = (event) => {
    const newMethod = event.target.value;
    setPaymentMethod(newMethod);
    onPaymentMethodChange(newMethod);
  };

  useEffect(() => {
    onPaymentMethodChange(paymentMethod);
  }, []);

  const paymentMethods = [
    { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: <img className='w-10 h-10' src='./cod.png' alt='COD' /> },
    { value: 'ZALOPAY', label: 'Thanh toán bằng ZALOPAY', icon: <img className="w-10 h-10" src='./zalopay-logo.png' alt='ZALOPAY'></img> },
  ];

  return (
    <Box sx={{ 
      width: '100%',
      border: '1px solid #e0e0e0', 
      borderRadius: 2,
      p: 3,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AddCardIcon sx={{mr:1}} />
        Phương thức thanh toán
      </Typography>
      <RadioGroup
        aria-label="payment-method"
        name="payment-method"
        value={paymentMethod}
        onChange={handlePaymentMethodChange}
      >
        {paymentMethods.map((method) => (
          <FormControlLabel
            key={method.value}
            value={method.value}
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {method.icon}
                <Typography sx={{ ml: 1 }}>{method.label}</Typography>
              </Box>
            }
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              mb: 1,
              p: 1,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default PaymentMethod;
