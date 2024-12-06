import React, { useEffect, useState } from 'react';
import { Box, useTheme, Button, InputBase, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { green } from '@mui/material/colors';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme/theme";
import Header from "../components/Header";
import promotionColumns from "../dataa/promotionColumns";
import { useDispatch, useSelector } from "react-redux";
import { getPromotions, toggleVisibility, deletePromotion, updatePromotion, findPromotionByCode } from "../../redux/Promotion/Action";
import AddPromotionDialog from '../components/AddPromotionDialog';
import EditPromotionDialog from '../components/EditPromotionDialog';
import ConfirmDeletePromotionDialog from '../components/ConfirmDeletePromotionDialog';
import { toast, ToastContainer } from 'react-toastify';
import useDebounce from '../../hooks/useDebounce'; // Import useDebounce
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const PromotionsTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const { promotions, loading, error } = useSelector(state => state.promotion);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [promotionToDelete, setPromotionToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rowsPerPage] = useState(7);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 1000);

    const fetchPromotions = async () => {
        try {
            const response = await dispatch(getPromotions(page, rowsPerPage));
            if (response?.promotions) {
                setFilteredPromotions(response?.promotions);
                setTotalPages(response?.totalPages);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách khuyến mãi:", error);
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            await dispatch(toggleVisibility(id));
            await fetchPromotions();
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái:", error);
            throw error;
        }
    };

    const handleSearch = async () => {
        if (debouncedSearchQuery) {
            setIsSearching(true);
            try {
                const result = await dispatch(findPromotionByCode(debouncedSearchQuery, page, rowsPerPage));
                if (result?.promotions) {
                    setFilteredPromotions(result.promotions);
                    setTotalPages(result.totalPages);
                }
            } catch (error) {
                toast.error("Không tìm thấy mã giảm giá: " + error.message);
                setFilteredPromotions([]);
                setTotalPages(1);
            }
        } else {
            setIsSearching(false);
            fetchPromotions();
            setFilteredPromotions([]);
        }
    };

    const handleEdit = (promotion) => {
        setSelectedPromotion(promotion);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (promotion) => {
        setPromotionToDelete(promotion);
        setOpenConfirmDelete(true);
    };

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false);
        setPromotionToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (promotionToDelete) {
            try {
                await dispatch(deletePromotion(promotionToDelete._id));
                toast.success("Xóa mã giảm giá thành công");
                await fetchPromotions();
            } catch (error) {
                toast.error("Xóa mã giảm giá thất bại");
            }
        }
        handleCloseConfirmDelete();
    };

    const handleSaveEdit = async (editedPromotion) => {
        try {
            await dispatch(updatePromotion(editedPromotion._id, editedPromotion));
            setFilteredPromotions((prevPromotions) =>
                prevPromotions.map((promo) =>
                    promo._id === editedPromotion._id ? editedPromotion : promo
                )
            );
            toast.success("Cập nhật mã giảm giá thành công");
        } catch (error) {
            toast.error("Cập nhật mã giảm giá thất bại: " + error.message);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        handleSearch();
    }, [debouncedSearchQuery]);

    useEffect(() => {
        if (isSearching && debouncedSearchQuery) {
            handleSearch();
        } else {
            fetchPromotions();
        }
    }, [page, dispatch]);

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
                <Header title="KHUYẾN MÃI" subtitle="Quản lý mã giảm giá" />
                <Box display="flex" gap={2}>
                    <Box display="flex" borderRadius="3px" backgroundColor={colors.primary[400]} height={50}>
                        <InputBase
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ ml: 2, flex: 1 }}
                            placeholder="Tìm kiếm mã giảm giá"
                            value={searchQuery}
                        />
                        <IconButton type="button" onClick={handleSearch} sx={{ p: 1 }}>
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>
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
                Thêm mã giảm giá
            </Button>
            <Box
                m="20px 0 0 0"
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
                    rows={filteredPromotions.length > 0 ? filteredPromotions : promotions.promotions}
                    columns={promotionColumns(colors, handleToggleVisibility, handleEdit, handleDeleteClick)}
                    getRowId={(row) => row._id}
                    hideFooter={true}
                    autoHeight
                    rowHeight={52}
                />
            </Box>

            <Box display="flex" 
                sx={{ 
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: colors.primary[400],
                    padding: '10px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    marginRight: '20px',
                }}
            >
                <Stack spacing={2}>
                    <Pagination 
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton 
                        showLastButton
                        size="medium"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                color: colors.grey[100],
                            },
                            "& .Mui-selected": {
                                backgroundColor: `${colors.blueAccent[500]} !important`,
                                color: '#fff !important',
                                fontWeight: 'bold',
                                "&:hover": {
                                    backgroundColor: `${colors.blueAccent[400]} !important`,
                                },
                            },
                            "& .MuiPaginationItem-previousNext": {
                                color: colors.grey[100],
                                "&:hover": {
                                    backgroundColor: colors.blueAccent[700],
                                },
                            },
                            "& .MuiPaginationItem-firstLast": {
                                color: colors.grey[100],
                                "&:hover": {
                                    backgroundColor: colors.blueAccent[700],
                                },
                            },
                        }}
                    />
                </Stack>
            </Box>

            <EditPromotionDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                promotion={selectedPromotion}
                onSave={handleSaveEdit}
            />

            <ConfirmDeletePromotionDialog
                open={openConfirmDelete}
                onClose={handleCloseConfirmDelete}
                onConfirm={handleConfirmDelete}
                promotionCode={promotionToDelete?.code}
            />

            <AddPromotionDialog
                open={openAddDialog}
                onClose={() => {
                    setOpenAddDialog(false);
                }}
                onPromotionCreated={fetchPromotions}
            />
        </Box>
    );
};

export default PromotionsTable;