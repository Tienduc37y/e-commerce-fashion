import { Box, Typography, Button, Select, MenuItem, Dialog, DialogTitle, DialogContent, Grid, IconButton } from "@mui/material";
import { convertDate, convertCurrency } from "../../common/convertCurrency";
import axiosInstance from "../../axios/api";
import { toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import OrderDetailsDialog from '../components/OrderDetailsDialog';

const StatusCell = ({ status, color, colors }) => (
    <Box
        width="auto"
        height="32px"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        sx={{
            backgroundColor: color,
            borderRadius: "4px",
            padding: "4px 12px",
            minWidth: "110px",
            boxShadow: `0 0 5px ${color}40`,
            transition: "all 0.2s ease",
            "&:hover": {
                opacity: 0.9,
                transform: "scale(1.02)",
            }
        }}
    >
        <Typography
            variant="body2"
            sx={{
                color: colors.grey[100],
                fontWeight: "bold",
                fontSize: "0.75rem",
                whiteSpace: "normal",
                overflow: "visible",
                textAlign: 'left'
            }}
        >
            {status}
        </Typography>
    </Box>
);

const handleStatusChange = async (orderId, newStatus, onStatusChange) => {
    try {
        let endpoint = '';
        switch(newStatus) {
            case "Đặt hàng thành công":
                endpoint = `/api/admin/orders/${orderId}/place`;
                break;
            case "Đang chờ xử lý":
                endpoint = `/api/admin/orders/${orderId}/pending`;
                break;
            case "Xác nhận đơn hàng":
                endpoint = `/api/admin/orders/${orderId}/confirmed`;
                break;
            case "Đang giao hàng":
                endpoint = `/api/admin/orders/${orderId}/ship`;
                break;
            case "Đã giao hàng":
                endpoint = `/api/admin/orders/${orderId}/deliver`;
                break;
            case "Đã thanh toán":
                endpoint = `/api/admin/orders/${orderId}/payment`;
                break;
            case "Đã hoàn thành":
                endpoint = `/api/admin/orders/${orderId}/complete`;
                break;
            case "Đã hủy":
                endpoint = `/api/admin/orders/${orderId}/cancel`;
                break;
            case "Hoàn trả hàng":
                endpoint = `/api/admin/orders/${orderId}/refund`;
                break;
            default:
                return;
        }
        
        const response = await axiosInstance.put(endpoint);
        if (response.data.status === "200") {
            if (onStatusChange) {
                onStatusChange();
            }
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
    }
};

const orderColumns = (colors, onStatusChange) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOpenDialog = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null);
    };

    return [
        { 
            field: "_id",
            headerName: "ID Đơn hàng",
            flex: 0.6,
            align: 'left'
        },
        {
            field: "username",
            headerName: "Username",
            flex: 0.3,
            align: 'left',
            renderCell: (params) => {
                return params.row?.user?.username || '';
            }
        },
        {
            field: "orderDate",
            headerName: "Ngày đặt",
            flex: 0.5,
            renderCell: (params) => {
                return convertDate(params.value);
            }
        },
        {
            field: "completeOrderDate",
            headerName: "Ngày hoàn thành",
            flex: 0.5,
            renderCell: (params) => {
                if (params.value) {
                    return convertDate(params.value);
                }
                return '';
            }
        },
        {
            field: "totalDiscountedPrice",
            headerName: "Giá",
            flex: 0.3,
            align: 'left',
            renderCell: (params) => {
                return new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                }).format(params.value);
            }
        },
        {
            field: "totalItem",
            headerName: "SL",
            flex: 0.1,
            align: 'left',
        },
        {
            field: "paymentMethod",
            headerName: "Phương thức",
            flex: 0.4,
            align: 'left',
            renderCell: (params) => {
                return params.row?.paymentDetails?.paymentMethod || '';
            }
        },
        {
            field: "paymentStatus",
            headerName: "Trạng thái thanh toán ZaloPay",
            flex: 0.65,
            align: 'left',
            renderCell: (params) => {
                const paymentMethod = params.row?.paymentDetails?.paymentMethod;
                
                // Nếu là COD thì không hiển thị trạng thái thanh toán
                if (paymentMethod === "COD") {
                    return null;
                }

                const status = params.row?.paymentDetails?.paymentStatus || '';
                const color = status === "Đã thanh toán" 
                    ? colors.greenAccent[500] 
                    : colors.redAccent[500];
                return <StatusCell status={status} color={color} colors={colors} />;
            }
        },
        {
            field: "orderStatus",
            headerName: "Trạng thái Đơn hàng",
            flex: 0.65,
            align: 'left',
            renderCell: (params) => {
                const currentStatus = params.row?.orderStatus || '';
                const orderId = params.row?._id;

                return (
                    <Select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(orderId, e.target.value, onStatusChange)}
                        sx={{
                            width: '200px',
                            height: '32px',
                            backgroundColor: colors.primary[400],
                            color: colors.grey[100],
                            '& .MuiSelect-select': {
                                padding: '4px 12px',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: colors.grey[400],
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: colors.grey[100],
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: colors.blueAccent[500],
                            }
                        }}
                    >
                        <MenuItem value="Đặt hàng thành công">Đặt hàng thành công</MenuItem>
                        <MenuItem value="Đang chờ xử lý">Đang chờ xử lý</MenuItem>
                        <MenuItem value="Xác nhận đơn hàng">Xác nhận đơn hàng</MenuItem>
                        <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
                        <MenuItem value="Đã giao hàng">Đã giao hàng</MenuItem>
                        <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                        <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
                        <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                        <MenuItem value="Hoàn trả hàng">Hoàn trả hàng</MenuItem>
                    </Select>
                );
            }
        },
        {
            field: "actions",
            headerName: "",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton 
                            onClick={() => handleOpenDialog(params.row)}
                            sx={{color: colors.greenAccent[500]}}
                        >
                            <VisibilityIcon />
                        </IconButton>
                        <OrderDetailsDialog 
                            open={openDialog}
                            handleClose={handleCloseDialog}
                            orderData={selectedOrder}
                        />
                    </>
                );
            }
        }
    ];
}

export default orderColumns;
