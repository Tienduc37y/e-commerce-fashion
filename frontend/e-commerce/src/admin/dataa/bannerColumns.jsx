import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Switch } from "@mui/material";
import { toast } from 'react-toastify';

const bannerColumns = (colors, onStatusChange, handleEdit, handleDelete) => {
    return [
        { 
            field: "_id",
            headerName: "ID",
            flex: 0.7,
        },
        { 
            field: "name",
            headerName: "Tên banner",
            flex: 1,
        },
        {
            field: "imageUrl",
            headerName: "Hình ảnh",
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="flex items-center h-full">
                        <img 
                            src={params.value} 
                            alt={params.row.name}
                            style={{ 
                                width: '100px', 
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }}
                        />
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
            headerName: 'Thao tác',
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

export default bannerColumns; 