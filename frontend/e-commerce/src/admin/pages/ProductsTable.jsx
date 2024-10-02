import { 
  Box, 
  useTheme, 
  TextField, 
  Button, 
  Dialog,
  DialogTitle, 
  DialogContent, 
  IconButton, 
  InputBase,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme/theme";
import Header from "../components/Header";
import productColumns from "../dataa/productsColumns";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteProductsById, findProducts, findProductsByName } from "../../redux/Product/Action";
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from "../../hooks/useDebounce";
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import AddProductDialog from '../components/AddProductDialog';
import { green } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import EditProductDialog from '../components/EditProductDialog';


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
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const debouncedSearchTerm = useDebounce(searchQuery, 2000);

  const { product } = useSelector(store => store);
  console.log(product)
  const fetchAllProducts = () => {
    const data = {
      category: "",
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
  };

  useEffect(() => {
    fetchAllProducts();
  }, [dispatch]);

  useEffect(() => {
    if (product.products) {
      setFilteredProducts(convertDataProducts(product.products));
    }
  }, [product.products]);

  useEffect(() => {
    if (searchQuery) {
      const localFilteredProducts = product.products.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(convertDataProducts(localFilteredProducts));
    } else {
      setFilteredProducts(convertDataProducts(product.products));
    }
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
  }, [debouncedSearchTerm, dispatch]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleSave = async (editedProduct) => {
    try {
      // Gọi API để cập nhật sản phẩm
      // Ví dụ: await dispatch(updateProduct(editedProduct));
      toast.success("Cập nhật sản phẩm thành công");
      setOpen(false);
      fetchAllProducts();
    } catch (error) {
      toast.error("Cập nhật sản phẩm thất bại: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProductsById(id));
      toast.success("Xóa thành công product với id " + id);
      await fetchAllProducts();
    } catch (error) {
      toast.error("Xóa không thành công product với id " + id);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const convertDataProducts = (data) => {
    return data.map((item) => ({
      id: item?._id,
      description: item?.description,
      imageUrl: item?.imageUrl.map(image => ({image: image.image, color: image.color})),
      title: item?.title,
      brand: item?.brand,
      category: item?.category?.name || "",
      sizes: item?.sizes.map(s => ({size: s.size, colors: s.colors.map(c => ({color: c.color, quantityItem: c.quantityItem}))})),
      price: item?.price,
      discountedPrice: item?.discountedPrice,
      discountedPersent: item?.discountedPersent,
    }));
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    fetchAllProducts();
  };

  const handleProductCreated = () => {
    fetchAllProducts();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
  };

  const handleAddSize = (size) => {
    if (size && !selectedSizes.some(s => s.size === size)) {
      setSelectedSizes([...selectedSizes, { size: size, colors: [] }]);
    }
  };

  const handleRemoveSize = (index) => {
    const newSizes = [...selectedSizes];
    newSizes.splice(index, 1);
    setSelectedSizes(newSizes);
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...selectedSizes];
    newSizes[index].size = value;
    setSelectedSizes(newSizes);
  };

  const handleAddColor = (sizeIndex) => {
    const newSizes = [...selectedSizes];
    newSizes[sizeIndex].colors.push({ color: '', quantityItem: 0 }); // Thay đổi ở đây
    setSelectedSizes(newSizes);
  };

  const handleColorChange = (sizeIndex, colorIndex, field, value) => {
    const newSizes = [...selectedSizes];
    newSizes[sizeIndex].colors[colorIndex][field] = value;
    setSelectedSizes(newSizes);
  };

  const handleRemoveColor = (sizeIndex, colorIndex) => {
    const newSizes = [...selectedSizes];
    newSizes[sizeIndex].colors.splice(colorIndex, 1);
    setSelectedSizes(newSizes);
  };

  const handleAddImage = () => {
    setSelectedImages([...selectedImages, { url: '', color: '' }]);
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...selectedImages];
    newImages[index][field] = value;
    setSelectedImages(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  return (
    <>
      
      <Box m="20px">
        <div className="flex justify-between items-center">
          <Header title="PRODUCTS" subtitle="Managing the Products" />
          
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
        </div>
        <Box mt={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              backgroundColor: green[500], // Sử dụng màu xanh lá cây
              '&:hover': {
                backgroundColor: green[700], // Màu khi hover
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
            columns={productColumns(colors, handleDelete, handleEdit)}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } }
            }}
          />
        </Box>
        <EditProductDialog
          open={open}
          onClose={handleClose}
          product={selectedProduct}
          onSave={handleSave}
        />

        <CustomDialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth={false}>
          <AddProductDialog onClose={handleCloseAddDialog} onProductCreated={handleProductCreated} />
        </CustomDialog>
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

export default ProductsTable;