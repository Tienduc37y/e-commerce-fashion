import { 
  Box, 
  useTheme, 
  InputBase,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme/theme";
import Header from "../components/Header";
import productColumns from "../dataa/productsColumns";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { deleteProductsById, findProducts, findProductsByName, updateProduct } from "../../redux/Product/Action";
import { toast, ToastContainer } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from "../../hooks/useDebounce";
import AddIcon from '@mui/icons-material/Add';
import AddProductDialog from '../components/AddProductDialog';
import { green } from '@mui/material/colors';
import EditProductDialog from '../components/EditProductDialog';
import { styled } from '@mui/material/styles';
import ConfirmDeleteProductDialog from '../components/ConfirmDeleteProductDialog';

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
    position: 'fixed',
    top: 0,
    right: 0,
  },
}));

const ProductsTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const debouncedSearchTerm = useDebounce(searchQuery, 2000);

  const { product } = useSelector(store => store);

  const fetchAllProducts = useCallback(() => {
    const data = {
      topLevelCategory: "",
      secondLevelCategory: "",
      thirdLevelCategory: "",
      colors: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 100000000000,
      minDiscount: 0,
      sort: "price_low",
      pageNumber: 1,
      pageSize: 30,
      stock: ""
    };
    dispatch(findProducts(data));
  }, [dispatch]);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  useEffect(() => {
    if (product.products) {
      setFilteredProducts(convertDataProducts(product.products));
    }
  }, [product.products]);

  useEffect(() => {
    const localFilteredProducts = searchQuery
      ? product.products.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : product.products;
    setFilteredProducts(convertDataProducts(localFilteredProducts));
  }, [searchQuery, product.products]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(findProductsByName(debouncedSearchTerm))
        .then(products => {
          if (Array.isArray(products)) {
            setFilteredProducts(convertDataProducts(products));
          } else {
            setFilteredProducts([]);
            toast.info("Không tìm thấy sản phẩm phù hợp");
          }
        })
        .catch(error => {
          toast.error("Lỗi khi tìm kiếm sản phẩm: " + error.message);
        });
    } else {
      fetchAllProducts();
    }
  }, [debouncedSearchTerm, dispatch, fetchAllProducts]);

  const handleEdit = useCallback((product) => {
    setSelectedProduct(product);
    setOpenEditDialog(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
  }, []);

  const handleSave = useCallback(async (editedProduct) => {
    try {
      await dispatch(updateProduct(editedProduct.id, editedProduct));
      toast.success("Cập nhật sản phẩm thành công");
      setOpenEditDialog(false);
      fetchAllProducts();
    } catch (error) {
      toast.error("Cập nhật sản phẩm thất bại: " + error.message);
    }
  }, [dispatch, fetchAllProducts]);

  const handleDeleteClick = useCallback((id) => {
    setProductToDelete(id);
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (productToDelete) {
      try {
        await dispatch(deleteProductsById(productToDelete));
        toast.success("Xóa thành công sản phẩm với id " + productToDelete);
        await fetchAllProducts();
      } catch (error) {
        toast.error("Xóa không thành công sản phẩm với id " + productToDelete);
      }
    }
    handleCloseDeleteDialog();
  }, [dispatch, fetchAllProducts, productToDelete]);

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const convertDataProducts = useCallback((data) => {
    return data.map((item) => ({
      id: item?._id,
      description: item?.description,
      imageUrl: item?.imageUrl.map(image => ({image: image.image, color: image.color})),
      title: item?.title,
      brand: item?.brand,
      category: item?.category || "",
      sizes: item?.sizes.map(s => ({size: s.size, colors: s.colors.map(c => ({color: c.color, quantityItem: c.quantityItem}))})),
      price: item?.price,
      discountedPrice: item?.discountedPrice,
      discountedPersent: item?.discountedPersent,
      quantity: item?.quantity
    }));
  }, []);

  const handleOpenAddDialog = useCallback(() => {
    setOpenAddDialog(true);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setOpenAddDialog(false);
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleProductCreated = useCallback(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <>
      <Box m="20px">
        <Box className="flex justify-between items-center">
          <Header title="Sản phẩm" subtitle="Quản lý sản phẩm" />
          
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
                placeholder="Search" 
                value={searchQuery}
              />
              <IconButton type="button" sx={{ p: 1 }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              backgroundColor: green[500],
              '&:hover': {
                backgroundColor: green[700],
              },
            }}
          >
            Thêm mới sản phẩm
          </Button>
        </Box>
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
            rows={filteredProducts}
            columns={productColumns(colors, handleDeleteClick, handleEdit)}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } }
            }}
          />
        </Box>
        <EditProductDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          product={selectedProduct}
          onSave={handleSave}
        />

        <CustomDialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth={false}>
          <AddProductDialog onClose={handleCloseAddDialog} onProductCreated={handleProductCreated} />
        </CustomDialog>

        <ConfirmDeleteProductDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
        />

      </Box>
      <ToastContainer
        position="top-right"
        autoClose={2000}
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

export default ProductsTable;