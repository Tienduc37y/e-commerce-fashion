import React, { useEffect, useState } from 'react';
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme/theme";
import Header from "../components/Header";
import teamColumns from "../dataa/teamColumns";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserById, getAllUsers, findUserByName, updateUser } from "../../redux/AllUsers/Action";
import { toast,ToastContainer } from 'react-toastify';
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import useDebounce from "../../hooks/useDebounce";
import IconButton from '@mui/material/IconButton';
import EditUserDialog from '../components/EditUserDialog';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import AddIcon from '@mui/icons-material/Add';
import AddUserDialog from '../components/AddUserDialog';
import { green } from '@mui/material/colors';
import { Pagination, Stack } from '@mui/material';

const CustomersTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { users } = useSelector(store => store);
  
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const debouncedSearchTerm = useDebounce(searchQuery, 1000);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (debouncedSearchTerm) {
          response = await dispatch(findUserByName(debouncedSearchTerm, page, rowsPerPage));
        } else {
          response = await dispatch(getAllUsers(page, rowsPerPage));
        }

        if (response?.pagination) {
          setTotalPages(response.pagination.totalPages);
          setFilteredUsers(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFilteredUsers([]);
      }
    };

    fetchData();
  }, [debouncedSearchTerm, page, rowsPerPage, dispatch]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async (updatedUser) => {
    try {
      const result = await dispatch(updateUser(updatedUser));
      if (result.success) {
        toast.success("Cập nhật thông tin người dùng thành công");
        setOpen(false);
        setPage(1); // Reset về page 1
        setFilteredUsers(prevUsers => {
          if (Array.isArray(prevUsers)) {
            return prevUsers.map(user => 
              user.id === result.user.id ? { ...user, ...result.user } : user
            );
          } else {
            console.error('prevUsers is not an array:', prevUsers);
            return [];
          }
        });
        dispatch(getAllUsers());
      } else {
        return { error: result.error };
      }
    } catch (error) {
      return { error: error.message };
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUserById(userToDelete.id));
        toast.success("Xóa thành công người dùng " + userToDelete.username);
        setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        dispatch(getAllUsers());
      } catch (error) {
        toast.error("Xóa không thành công người dùng " + userToDelete.username);
      }
    }
    handleCloseConfirmDelete();
  };

  const convertDataUsers = (users) => {
    if (!Array.isArray(users)) {
      console.error('users is not an array:', users);
      return [];
    }
    return users.map((user) => ({
      ...user,
      id: user._id || user.id,
      role: user.role === "ADMIN" ? "ADMIN" : "USER",
      username: user.username
    }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset về trang 1 khi search
  };

  const handleOpenAddUserDialog = () => {
    setOpenAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
  };

  const handleUserCreated = async () => {
    try {
      const response = await dispatch(getAllUsers(page, rowsPerPage));
      
      if (response?.pagination) {
        setTotalPages(response.pagination.totalPages);
        setFilteredUsers(response.data || []);
        
        if (page > response.pagination.totalPages) {
          setPage(response.pagination.totalPages);
        }
      }
      
      handleCloseAddUserDialog();
    } catch (error) {
      console.error("Error updating users after creation:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Box m="5px">
        <div className="flex justify-between items-center">
          <Header title="Quản lý người dùng" />

          <Box display="flex" gap={2}>
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
          </Box>
        </div>
        <Box>
          <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddUserDialog}
                sx={{
                  backgroundColor: green[500],
                  '&:hover': {
                    backgroundColor: green[700],
                  },
                }}
              >
                Thêm mới người dùng
          </Button>
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
              backgroundColor: colors.blueAccent[700],
              borderTop: "none",
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid
            rows={convertDataUsers(filteredUsers)}
            columns={teamColumns(colors, handleDeleteClick, handleEdit)}
            getRowId={(row) => row.id || row._id}
            hideFooter={true}
            autoHeight
          />
        </Box>

        <Box display="flex" 
          sx={{ 
            position: 'fixed',
            bottom: '20px',
            right: '20px', // Thay đổi từ left sang right và bỏ transform
            backgroundColor: colors.primary[400],
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            marginRight: '20px', // Thêm margin để tránh sát mép
          }}>
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

        <EditUserDialog 
          open={open} 
          onClose={handleClose} 
          user={selectedUser} 
          onSave={handleSave}
        />

        <ConfirmDeleteDialog
          open={openConfirmDelete}
          onClose={handleCloseConfirmDelete}
          onConfirm={handleConfirmDelete}
          userName={userToDelete?.username}
        />

        <AddUserDialog
          open={openAddUserDialog}
          onClose={handleCloseAddUserDialog}
          onUserCreated={handleUserCreated}
        />
      </Box>
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
    </>
  );
};

export default CustomersTable;
