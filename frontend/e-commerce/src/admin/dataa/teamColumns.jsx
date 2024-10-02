import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { Box, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
const teamColumns = (colors, handleDelete, handleEdit) => {

    return [
        { 
            field: "id",
            headerName: "ID",
            flex:0.75 
        },
        {
            field: "username",
            headerName: "Username",
            flex: 0.75,
            cellClassName: "name-column--cell",
        },
        {
            field: "firstName",
            headerName: "Họ",
            flex: 0.5,
            cellClassName: "name-column--cell",
        },
        {
            field: "lastName",
            headerName: "Tên",
            flex: 0.5,
            cellClassName: "name-column--cell",
        },
        {
            field: "mobile",
            headerName: "Số điện thoại",
            flex: 0.5,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "accessLevel",
            headerName: "Quyền",
            flex: 0.75,
            renderCell: ({ row: { access } }) => {
                return (
                    <div className="flex items-center h-full">
                        <Box
                            width="50%"
                            m="0 auto"
                            p="10px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={
                                access === "ADMIN"
                                    ? colors.greenAccent[800]
                                    : colors.greenAccent[500]
                            }
                            borderRadius="4px"
                        >
                            {access === "ADMIN" && <AdminPanelSettingsOutlinedIcon />}
                            {access === "USER" && <LockOpenOutlinedIcon />}
                            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                                {access}
                            </Typography>
                        </Box>
                    </div>
                );
            },
        },
        {
            field: 'actions',
            headerName: '',
            flex: 0.5,
            renderCell: (params) => (
                params.row.access === "ADMIN" ? "" : ( 
                    <>
                        <IconButton onClick={() => handleEdit(params.row)} size="large">
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(params.row.id)} size="large">
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </>             
                )
            ),
          },
    ];
}

export default teamColumns;