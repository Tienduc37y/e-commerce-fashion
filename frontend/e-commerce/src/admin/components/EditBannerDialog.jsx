import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Switch,
    FormControlLabel
} from '@mui/material';

const EditBannerDialog = ({ open, onClose, banner, onSave }) => {
    const [name, setName] = useState('');
    const [visible, setVisible] = useState(true);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isImageChanged, setIsImageChanged] = useState(false);

    useEffect(() => {
        if (banner) {
            setName(banner.name);
            setVisible(banner.visible);
            setPreviewUrl(banner.imageUrl);
            setImage(null);
            setIsImageChanged(false);
        }
    }, [banner]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setIsImageChanged(true);
        }
    };

    const handleSubmit = () => {
        if (!name) {
            return;
        }

        const editedBanner = {
            _id: banner._id,
            name,
            visible,
        };

        if (isImageChanged && image) {
            editedBanner.image = image;
        }

        onSave(editedBanner);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chỉnh Sửa Banner</DialogTitle>
            <DialogContent>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Tên banner"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={visible}
                                onChange={(e) => setVisible(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Hiển thị"
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
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBannerDialog; 