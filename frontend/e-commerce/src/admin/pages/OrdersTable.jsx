import React, { useEffect, useState } from 'react';
import { Box, useTheme, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme/theme";
import Header from "../components/Header";
import orderColumns from "../dataa/orderColumns";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../redux/Order/Action";
import { Pagination, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axiosInstance from '../../axios/api';
import { toast } from 'react-toastify';

const OrdersTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const order = useSelector(state => state.order);
    
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(8);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const orderStatuses = [
        { value: '', label: 'Tất cả trạng thái' },
        { value: 'Đặt hàng thành công', label: 'Đặt hàng thành công' },
        { value: 'Đang chờ xử lý', label: 'Đang chờ xử lý' },
        { value: 'Xác nhận đơn hàng', label: 'Xác nhận đơn hàng' },
        { value: 'Đang giao hàng', label: 'Đang giao hàng' },
        { value: 'Đã giao hàng', label: 'Đã giao hàng' },
        { value: 'Đã hủy', label: 'Đã hủy' },
        { value: 'Đã thanh toán', label: 'Đã thanh toán' },
        { value: 'Đã hoàn thành', label: 'Đã hoàn thành' },
        { value: 'Hoàn trả hàng', label: 'Hoàn trả hàng' }
    ];

    const sortOptions = [
        { value: '', label: 'Tất cả giá trị' },
        { value: 'desc', label: 'Giá trị giảm dần' },
        { value: 'asc', label: 'Giá trị tăng dần' }
    ];

    const paymentMethods = [
        { value: '', label: 'Tất cả phương thức' },
        { value: 'COD', label: 'Thanh toán khi nhận hàng' },
        { value: 'ZALOPAY', label: 'Thanh toán ZaloPay' }
    ];

    const fetchOrders = async () => {
        try {
            const statusParam = status === '' ? '' : status;
            const sortParam = sort === '' ? '' : sort;
            const paymentMethodParam = paymentMethod === '' ? '' : paymentMethod;
            const dateParam = selectedDate === '' ? '' : selectedDate;
            await dispatch(getAllOrders(page, rowsPerPage, statusParam, sortParam, paymentMethodParam, dateParam));
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
            toast.error("Không thể tải danh sách đơn hàng");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [dispatch, page, rowsPerPage, status, sort, paymentMethod, selectedDate]);

    const resetFilters = () => {
        setStatus('');
        setSort('');
        setPaymentMethod('');
        setSelectedDate('');
        setPage(1);
    };

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            resetFilters();
            
            const response = await axiosInstance.get('/api/payment/all-orders-status');
            if (response.data.status === "200") {
                toast.success("Cập nhật trạng thái thành công");
                await dispatch(getAllOrders(1, rowsPerPage, '', '', '', ''));
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        } finally {
            setIsRefreshing(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        setPage(1);
    };

    const handleSortChange = (event) => {
        const newSort = event.target.value;
        setSort(newSort);
        setPage(1);
    };

    const handlePaymentMethodChange = (event) => {
        const newPaymentMethod = event.target.value;
        setPaymentMethod(newPaymentMethod);
        setPage(1);
    };

    const handleDateChange = (event) => {
        const newDate = event.target.value;
        setSelectedDate(newDate);
        setPage(1);
    };

    return (
        <>
            <Box m="5px">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="ĐƠN HÀNG" subtitle="Quản lý đơn hàng" />
                    <Box display="flex" gap={2} alignItems="center">
                        <TextField
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            InputLabelProps={{
                                shrink: true,
                                sx: {
                                    color: colors.grey[100],
                                    '&.Mui-focused': {
                                        color: colors.grey[100]
                                    },
                                    backgroundColor: 'transparent',
                                    padding: '0 4px',
                                }
                            }}
                            label="Lọc theo ngày"
                            sx={{
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                    color: colors.grey[100],
                                    '& fieldset': {
                                        borderColor: colors.grey[700],
                                    },
                                    '&:hover fieldset': {
                                        borderColor: colors.grey[500],
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: colors.grey[500],
                                    },
                                },
                                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                    filter: 'invert(1)',
                                    cursor: 'pointer'
                                }
                            }}
                        />

                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel 
                                id="status-select-label"
                                sx={{ 
                                    color: colors.grey[100],
                                    '&.Mui-focused': {
                                        color: colors.grey[100]
                                    }
                                }}
                            >
                                Trạng thái
                            </InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={status}
                                label="Trạng thái"
                                onChange={handleStatusChange}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: colors.primary[400],
                                        }
                                    }
                                }}
                                sx={{
                                    color: colors.grey[100],
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[700],
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[500],
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[500],
                                    },
                                    '.MuiSvgIcon-root': {
                                        color: colors.grey[100],
                                    }
                                }}
                            >
                                {orderStatuses.map((option) => (
                                    <MenuItem 
                                        key={option.value} 
                                        value={option.value}
                                        sx={{
                                            color: colors.grey[100],
                                            backgroundColor: colors.primary[400],
                                            '&:hover': {
                                                backgroundColor: colors.primary[500],
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: colors.primary[600],
                                                '&:hover': {
                                                    backgroundColor: colors.primary[700],
                                                }
                                            }
                                        }}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel 
                                id="payment-method-select-label"
                                sx={{ 
                                    color: colors.grey[100],
                                    '&.Mui-focused': {
                                        color: colors.grey[100]
                                    }
                                }}
                            >
                                Phương thức thanh toán
                            </InputLabel>
                            <Select
                                labelId="payment-method-select-label"
                                value={paymentMethod}
                                label="Phương thức thanh toán"
                                onChange={handlePaymentMethodChange}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: colors.primary[400],
                                        }
                                    }
                                }}
                                sx={{
                                    color: colors.grey[100],
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[700],
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[500],
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[500],
                                    },
                                    '.MuiSvgIcon-root': {
                                        color: colors.grey[100],
                                    }
                                }}
                            >
                                {paymentMethods.map((option) => (
                                    <MenuItem 
                                        key={option.value} 
                                        value={option.value}
                                        sx={{
                                            color: colors.grey[100],
                                            backgroundColor: colors.primary[400],
                                            '&:hover': {
                                                backgroundColor: colors.primary[500],
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: colors.primary[600],
                                                '&:hover': {
                                                    backgroundColor: colors.primary[700],
                                                }
                                            }
                                        }}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel 
                                id="sort-select-label"
                                sx={{ 
                                    color: colors.grey[100],
                                    '&.Mui-focused': {
                                        color: colors.grey[100]
                                    }
                                }}
                            >
                                Sắp xếp
                            </InputLabel>
                            <Select
                                labelId="sort-select-label"
                                value={sort}
                                label="Sắp xếp"
                                onChange={handleSortChange}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: colors.primary[400],
                                        }
                                    }
                                }}
                                sx={{
                                    color: colors.grey[100],
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[700],
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[500],
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[500],
                                    },
                                    '.MuiSvgIcon-root': {
                                        color: colors.grey[100],
                                    }
                                }}
                            >
                                {sortOptions.map((option) => (
                                    <MenuItem 
                                        key={option.value} 
                                        value={option.value}
                                        sx={{
                                            color: colors.grey[100],
                                            backgroundColor: colors.primary[400],
                                            '&:hover': {
                                                backgroundColor: colors.primary[500],
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: colors.primary[600],
                                                '&:hover': {
                                                    backgroundColor: colors.primary[700],
                                                }
                                            }
                                        }}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Tooltip title="Cập nhật trạng thái và làm mới bộ lọc">
                            <IconButton 
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                sx={{
                                    backgroundColor: colors.blueAccent[700],
                                    '&:hover': {
                                        backgroundColor: colors.blueAccent[800],
                                    },
                                }}
                            >
                                <RefreshIcon 
                                    sx={{ 
                                        color: colors.grey[100],
                                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                                        '@keyframes spin': {
                                            '0%': {
                                                transform: 'rotate(0deg)',
                                            },
                                            '100%': {
                                                transform: 'rotate(360deg)',
                                            },
                                        },
                                    }} 
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Box
                    m="10px 0 0 0"
                    height="auto"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                            minHeight: "400px",
                            maxHeight: "calc(100vh - 200px)",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .name-column--cell": {
                            color: colors.greenAccent[300],
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
                        "& .MuiMenu-paper": {
                            backgroundColor: colors.primary[400],
                            "& .MuiMenuItem-root": {
                                color: colors.grey[100],
                                "&:hover": {
                                    backgroundColor: colors.primary[500],
                                },
                                "&.Mui-selected": {
                                    backgroundColor: colors.blueAccent[500],
                                    "&:hover": {
                                        backgroundColor: colors.blueAccent[600],
                                    }
                                }
                            }
                        }
                    }}
                >
                    <DataGrid
                        loading={order.loading}
                        rows={order.allOrders?.orders || []}
                        columns={orderColumns(colors, fetchOrders)}
                        getRowId={(row) => row._id}
                        hideFooter={true}
                        autoHeight
                        rowHeight={52}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                padding: '8px',
                            }
                        }}
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
                    }}>
                    <Stack spacing={2}>
                        <Pagination 
                            count={order.allOrders?.totalPages || 1}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton 
                            showLastButton
                            size="medium"
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    color: colors.grey[100]
                                },
                                "& .Mui-selected": {
                                    backgroundColor: `${colors.blueAccent[500]} !important`,
                                    color: '#fff !important',
                                    fontWeight: 'bold',
                                    "&:hover": {
                                        backgroundColor: `${colors.blueAccent[400]} !important`,
                                    }
                                },
                                "& .MuiPaginationItem-previousNext": {
                                    color: colors.grey[100],
                                    "&:hover": {
                                        backgroundColor: colors.blueAccent[700],
                                    }
                                },
                                "& .MuiPaginationItem-firstLast": {
                                    color: colors.grey[100],
                                    "&:hover": {
                                        backgroundColor: colors.blueAccent[700],
                                    }
                                }
                            }}
                        />
                    </Stack>
                </Box>
            </Box>
        </>
    );
};

export default OrdersTable;