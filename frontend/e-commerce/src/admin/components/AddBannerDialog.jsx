import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createBanner } from '../../redux/Banner/Action';
import { toast } from 'react-toastify';

const AddBannerDialog = ({ open, onClose, onBannerCreated }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !image) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('image', image);
            formData.append('visible', true);

            await dispatch(createBanner(formData));
            toast.success("Tạo banner thành công");
            onBannerCreated();
            onClose();
            setName('');
            setImage(null);
            setPreviewUrl('');
        } catch (error) {
            toast.error("Tạo banner thất bại: " + error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thêm Banner Mới</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Tên banner"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleImageChange}
                        style={{ marginTop: '20px' }}
                    />
                    {previewUrl && (
                        <Box mt={2}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddBannerDialog; 