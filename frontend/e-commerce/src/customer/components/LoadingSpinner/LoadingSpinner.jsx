import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => {
    return (
        <Box className="flex justify-center items-center min-h-[400px]">
            <CircularProgress />
        </Box>
    );
};

export default LoadingSpinner; 