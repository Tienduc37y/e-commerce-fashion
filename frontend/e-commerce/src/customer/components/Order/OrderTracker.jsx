import { Step, StepLabel, Stepper } from '@mui/material'
import React from 'react'

const steps = [
    "Địa chỉ",
    "Xác nhận đơn hàng",
    "Vận chuyển",
    "Vị trí nhận hàng",
    "Đã giao hàng",
]
const OrderTracker = ({activeStep}) => {
  return (
    <div className='w-full'>
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label,index) => (
                <Step>
                    <StepLabel sx={{color:"#9155FD", fontSize:"44px"}}>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    </div>
  )
}

export default OrderTracker