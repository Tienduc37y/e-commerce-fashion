import React, { useEffect, useState } from 'react';
import { Box, useTheme, TextField, Button, Dialog, DialogTitle, DialogContent, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme/theme";
import Header from "../components/Header";
import teamColumns from "../dataa/teamColumns";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserById, getAllUsers, findUserByName, updateUser } from "../../redux/AllUsers/Action";
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import useDebounce from "../../hooks/useDebounce";
import { styled } from '@mui/material/styles';

// Thêm component styled mới
const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  '& .MuiDialog-paper': {
    width: '50%',
    height: '100%',
    maxHeight: '100%',
    margin: 0,
    borderRadius: 0,
  },
}));

const CustomersTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { users } = useSelector(store => store);
  
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [errors, setErrors] = useState({});

  const debouncedSearchTerm = useDebounce(searchQuery, 1000);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users?.users) {
      setFilteredUsers(users.users);
    }
  }, [users]);

  useEffect(() => {
    if (searchQuery) {
      const localFilteredUsers = users.users.filter(item => 
        item.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(localFilteredUsers);
    } else {
      setFilteredUsers(users.users);
    }
  }, [searchQuery, users.users]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(findUserByName(debouncedSearchTerm))
        .then(result => {
          if (Array.isArray(result) && result.length > 0) {
            setFilteredUsers(result);
          } else {
            setFilteredUsers([]);
          }
        })
        .catch(error => {
          toast.error("Lỗi khi tìm kiếm người dùng: " + error.message);
        });
    } else {
      dispatch(getAllUsers());
    }
  }, [debouncedSearchTerm, dispatch]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async () => {
    try {
      const updatedUserData = {
        id: selectedUser.id,
        mobile: selectedUser.mobile,
        email: selectedUser.email,
      };

      const updatedUser = await dispatch(updateUser(updatedUserData));
      toast.success("Cập nhật thông tin người dùng thành công");
      setOpen(false);

      // Cập nhật filteredUsers với dữ liệu mới
      setFilteredUsers(prevUsers => {
        if (!Array.isArray(prevUsers)) {
          console.error('prevUsers is not an array:', prevUsers);
          return [updatedUser]; // Trả về một mảng mới chỉ chứa người dùng vừa cập nhật
        }
        return prevUsers.map(user => 
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        );
      });

      // Cập nhật lại toàn bộ danh sách người dùng
      dispatch(getAllUsers());
    } catch (error) {
      toast.error("Cập nhật thông tin người dùng thất bại: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUserById(id));
      toast.success("Xóa thành công user với id " + id);
    } catch (error) {
      toast.error("Xóa không thành công user với id " + id);
    }
  };

  const convertDataUsers = (data) => {
    return data.map((item, index) => ({
      id: item?._id || `temp-id-${index}`,
      firstName: item?.firstName || '',
      lastName: item?.lastName || '',
      username: item?.username || '',
      mobile: item?.mobile || '',
      email: item?.email || '',
      access: item?.role === "CUSTOMER" ? "USER" : "ADMIN"
    }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Box m="20px">
        <div className="flex justify-between">
          <Header title="TEAM" subtitle="Managing the Team Members" />

          <Box
            display="flex"
            borderRadius="3px"
            backgroundColor={colors.primary[400]}
            height={50}
          >
            <InputBase 
              onChange={handleSearch} 
              sx={{ ml: 2, flex: 1 }} 
              placeholder="Tìm kiếm" 
              value={searchQuery}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </div>

        <Box
          m="40px 0 0 0"
          height="70vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
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
              backgroundColor: colors.blueAccent[700],
              borderTop: "none",
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid
            rows={convertDataUsers(filteredUsers || [])}
            columns={teamColumns(colors, handleDelete, handleEdit)}
            getRowId={(row) => row.id}
          />
        </Box>

        <CustomDialog open={open} onClose={handleClose} fullWidth maxWidth={false}>
          <Paper style={{ height: '100vh', overflow: 'auto' }}>
            <DialogTitle className="flex justify-between">
              <span>Chỉnh sửa Người dùng</span>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <TextField
                disabled
                margin="dense"
                label="Tên"
                type="text"
                fullWidth
                value={selectedUser?.firstName || ""}
              />
              <TextField
                disabled
                margin="dense"
                label="Họ"
                type="text"
                fullWidth
                value={selectedUser?.lastName || ""}
              />
              <TextField
                disabled
                margin="dense"
                label="Tên người dùng"
                type="text"
                fullWidth
                value={selectedUser?.username || ""}
              />
              <TextField
                margin="dense"
                label="Số điện thoại"
                type="text"
                fullWidth
                value={selectedUser?.mobile || ""}
                onChange={(e) => setSelectedUser({ ...selectedUser, mobile: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={selectedUser?.email || ""}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
              <TextField
                disabled
                margin="dense"
                label="Quyền truy cập"
                type="text"
                fullWidth
                value={selectedUser?.access || ""}
              />
              <Box mt={2} display={"flex"} gap={2}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Lưu thay đổi
                </Button>
                <Button variant="contained" color="error" onClick={handleClose}>
                  Hủy bỏ
                </Button>
              </Box>
            </DialogContent>
          </Paper>
        </CustomDialog>

        {/* Dialog code remains the same */}
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default CustomersTable;