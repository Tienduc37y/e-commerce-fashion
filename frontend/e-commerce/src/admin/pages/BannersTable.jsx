import React, { useEffect, useState } from 'react';
import { Box, useTheme, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { green } from '@mui/material/colors';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme/theme";
import Header from "../components/Header";
import bannerColumns from "../dataa/bannerColumns";
import { useDispatch, useSelector } from "react-redux";
import { getBanners, updateBanner, deleteBanner } from "../../redux/Banner/Action";
import { toast, ToastContainer } from 'react-toastify';
import AddBannerDialog from '../components/AddBannerDialog';
import EditBannerDialog from '../components/EditBannerDialog';
import ConfirmDeleteBannerDialog from '../components/ConfirmDeleteBannerDialog';

const BannersTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const { banners, loading } = useSelector(state => state.banner);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    const fetchBanners = async () => {
        try {
            await dispatch(getBanners());
        } catch (error) {
            console.error("Lỗi khi tải danh sách banner:", error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, [dispatch]);

    const handleToggleVisibility = async (id) => {
        try {
            const bannerToUpdate = banners.find(banner => banner._id === id);
            if (bannerToUpdate) {
                await dispatch(updateBanner(id, {
                    ...bannerToUpdate,
                    visible: !bannerToUpdate.visible
                }));
                await fetchBanners();
                toast.success("Cập nhật trạng thái thành công");
            }
        } catch (error) {
            toast.error("Lỗi khi thay đổi trạng thái");
        }
    };

    const handleEdit = (banner) => {
        setSelectedBanner(banner);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (banner) => {
        setBannerToDelete(banner);
        setOpenConfirmDelete(true);
    };

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false);
        setBannerToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (bannerToDelete) {
            try {
                await dispatch(deleteBanner(bannerToDelete._id));
                toast.success("Xóa banner thành công");
                await fetchBanners();
            } catch (error) {
                toast.error("Xóa banner thất bại");
            }
        }
        handleCloseConfirmDelete();
    };

    const handleSaveEdit = async (editedBanner) => {
        try {
            const formData = new FormData();
            formData.append('name', editedBanner.name);
            formData.append('visible', editedBanner.visible);
            if (editedBanner.image) {
                formData.append('image', editedBanner.image);
            }

            await dispatch(updateBanner(editedBanner._id, formData));
            await fetchBanners();
            toast.success("Cập nhật banner thành công");
            setOpenEditDialog(false);
        } catch (error) {
            toast.error("Cập nhật banner thất bại: " + error.message);
        }
    };

    return (
        <Box m="5px">
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="flex justify-between items-center">
                <Header title="Quản lý banner" />
            </div>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddDialog(true)}
                sx={{
                    backgroundColor: green[500],
                    '&:hover': {
                        backgroundColor: green[700],
                    },
                    height: 'fit-content'
                }}
            >
                Thêm banner
            </Button>

            <Box
                m="10px 0 0 0"
                height="auto"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        display: "none"
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid
                    loading={loading}
                    rows={banners}
                    columns={bannerColumns(colors, handleToggleVisibility, handleEdit, handleDeleteClick)}
                    getRowId={(row) => row._id}
                    hideFooter={true}
                    autoHeight
                    rowHeight={80}
                />
            </Box>

            <EditBannerDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                banner={selectedBanner}
                onSave={handleSaveEdit}
            />

            <ConfirmDeleteBannerDialog
                open={openConfirmDelete}
                onClose={handleCloseConfirmDelete}
                onConfirm={handleConfirmDelete}
                bannerName={bannerToDelete?.name}
            />

            <AddBannerDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onBannerCreated={fetchBanners}
            />
        </Box>
    );
};

export default BannersTable; 