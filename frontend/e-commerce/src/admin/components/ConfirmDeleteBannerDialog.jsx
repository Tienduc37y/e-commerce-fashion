import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';

const ConfirmDeleteBannerDialog = ({ open, onClose, onConfirm, bannerName }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogContent>
                <Typography>
                    Bạn có chắc chắn muốn xóa banner "{bannerName}" không?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteBannerDialog; 