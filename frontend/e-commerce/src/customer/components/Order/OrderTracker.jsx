import { Step, StepLabel, Stepper } from '@mui/material'
import React from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import UndoIcon from '@mui/icons-material/Undo';

const CANCELED_STEPS = [
  "Đặt hàng thành công",
  "Đang chờ xử lý",
  "Đã hủy"
]

const REFUND_STEPS = [
  "Đặt hàng thành công",
  "Đang chờ xử lý",
  "Xác nhận đơn hàng",
  "Đang giao hàng",
  "Đã giao hàng",
  "Đã thanh toán",
  "Đã hoàn thành",
  "Hoàn trả hàng",
]

const COD_STEPS = [
  "Đặt hàng thành công",
  "Đang chờ xử lý",
  "Xác nhận đơn hàng",
  "Đang giao hàng",
  "Đã giao hàng",
  "Đã thanh toán",
  "Đã hoàn thành"
]

const ZALOPAY_STEPS = [
  "Đặt hàng thành công",
  "Đang chờ xử lý",
  "Đã thanh toán",
  "Xác nhận đơn hàng",
  "Đang giao hàng",
  "Đã giao hàng",
  "Đã hoàn thành"
]

const OrderTracker = ({ activeStep, paymentMethod }) => {
  let steps;
  if (activeStep === "Đã hủy") {
    steps = CANCELED_STEPS;
  } else if (activeStep === "Hoàn trả hàng") {
    steps = REFUND_STEPS;
  } else {
    steps = paymentMethod === 'COD' ? COD_STEPS : ZALOPAY_STEPS;
  }
  
  const currentStepIndex = steps.findIndex(step => step === activeStep);

  return (
    <div className='w-full overflow-x-auto'>
      <Stepper 
        activeStep={currentStepIndex} 
        alternativeLabel
        className='min-w-[600px] md:min-w-full'
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel 
              StepIconProps={{
                icon: label === "Đã hủy" ? <ClearIcon sx={{color: 'red'}} /> :
                      label === "Hoàn trả hàng" ? <UndoIcon sx={{color: '#FF9800'}} /> :
                      index + 1,
                sx: {
                  width: {xs: '1.5rem', md: '2rem'},
                  height: {xs: '1.5rem', md: '2rem'}
                }
              }}
              sx={{
                color: label === "Đã hủy" ? "red" : 
                       label === "Hoàn trả hàng" ? "#FF9800" : "#9155FD",
                '& .MuiStepLabel-label': {
                  color: label === "Đã hủy" ? "red" : 
                         label === "Hoàn trả hàng" ? "#FF9800" : "inherit",
                  fontSize: {xs: '0.75rem', md: '1rem'},
                  mt: 1
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}

export default OrderTracker