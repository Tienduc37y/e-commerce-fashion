import { Box, Typography, Switch } from "@mui/material";
import { convertCurrency, convertDate } from "../../common/convertCurrency";
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const promotionColumns = (colors, onStatusChange, handleEdit, handleDelete) => {
    return [
        { 
            field: "_id",
            headerName: "ID",
            flex: 0.7,
            renderCell: (params) => {
                return (
                    <div className="flex items-center h-full">
                        {params.value}
                    </div>
                );
            }
        },
        { 
            field: "code",
            headerName: "Mã giảm giá",
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <div className="flex items-center h-full">
                        {params.value}
                    </div>
                );
            }
        },
        {
            field: "discountPercentage",
            headerName: "Giảm giá (%)",
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <div className="flex items-center h-full">
                        {`${params.value}%`}
                    </div>
                );
            }
        },
        {
            field: "minOrderValue",
            headerName: "Đơn tối thiểu",
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <div className="flex items-center h-full">
                        {convertCurrency(params.value)}
                    </div>
                );
            }
        },
        {
            field: "description",
            headerName: "Mô tả",
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="flex items-center h-full">
                        {params.value}
                    </div>
                );
            }
        },
        {
            field: "endDate",
            headerName: "Ngày hết hạn",
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <div className="flex items-center h-full">
                        {convertDate(params.value)}
                    </div>
                );
            }
        },
        {
            field: "visible",
            headerName: "Trạng thái",
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <div className="flex items-center h-full">
                        <Switch
                            checked={params.value}
                            onChange={async () => {
                                try {
                                    await onStatusChange(params.row._id);
                                } catch (error) {
                                    toast.error("Có lỗi xảy ra khi thay đổi trạng thái");
                                }
                            }}
                            color="success"
                        />
                    </div>
                );
            }
        },
        {
            field: 'actions',
            headerName: '',
            flex: 0.5,
            renderCell: (params) => (
                <div className="flex items-center h-full">
                    <IconButton onClick={() => handleEdit(params.row)} size="large">
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row)} size="large">
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </div>
            ),
        },
    ];
};

export default promotionColumns; 