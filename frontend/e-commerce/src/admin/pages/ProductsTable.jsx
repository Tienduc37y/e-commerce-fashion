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
  DialogTitle,
  Pagination,
  Stack,
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
import { getTopLevelCategory, getSecondLevelCategory, getThirdLevelCategory } from "../../redux/Category/Action";

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
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const [searchPage, setSearchPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPagination, setSearchPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalItems: 0
  });
  const [sort, setSort] = useState('');
  const [topLevel, setTopLevel] = useState("");
  const [secondLevel, setSecondLevel] = useState("");
  const [thirdLevel, setThirdLevel] = useState("");
  const [stockFilter, setStockFilter] = useState('');

  const debouncedSearchTerm = useDebounce(searchQuery, 1000);

  const { product, categories } = useSelector(store => store);

  useEffect(() => {
    dispatch(getTopLevelCategory());
    dispatch(getSecondLevelCategory());
    dispatch(getThirdLevelCategory());
  }, [dispatch]);

  const fetchAllProducts = useCallback((pageNumber = 1) => {
    const data = {
      topLevelCategory: topLevel,
      secondLevelCategory: secondLevel,
      thirdLevelCategory: thirdLevel,
      colors: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 100000000000,
      minDiscount: 0,
      sort: sort,
      pageNumber: pageNumber,
      pageSize: rowsPerPage,
      stock: stockFilter
    };
    dispatch(findProducts(data));
  }, [dispatch, rowsPerPage, sort, topLevel, secondLevel, thirdLevel, stockFilter]);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const convertDataProducts = useCallback((data) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data.map((item) => ({
      id: item?._id,
      title: item?.title,
      description: item?.description,
      price: item?.price,
      discountedPrice: item?.discountedPrice,
      discountedPersent: item?.discountedPersent,
      brand: item?.brand,
      quantity: item?.quantity,
      sellQuantity: item?.sellQuantity,
      variants: item?.variants.map(variant => ({
        color: variant.color,
        nameColor: variant.nameColor,
        imageUrl: variant.imageUrl,
        sizes: variant.sizes.map(size => ({
          size: size.size,
          quantityItem: size.quantityItem
        }))
      })),
      category: {
        topLevelCategory: item?.category?.topLevelCategory?.name,
        secondLevelCategory: item?.category?.secondLevelCategory?.name,
        thirdLevelCategory: item?.category?.thirdLevelCategory?.name
      },
      numRatings: item?.numRatings,
      createdAt: item?.createdAt
    }));
  }, []);

  useEffect(() => {
    if (product?.products?.content) {
      setFilteredProducts(convertDataProducts(product.products.content));
    }
  }, [product.products, convertDataProducts]);

  useEffect(() => {
    if (!debouncedSearchTerm) {
        setIsSearching(false);
        setSearchPage(1);
        setSearchPagination({
            totalPages: 1,
            currentPage: 1,
            totalItems: 0
        });
        fetchAllProducts(page);
        return;
    }

    const searchProducts = async () => {
        try {
            setIsSearching(true);
            const result = await dispatch(findProductsByName(debouncedSearchTerm, searchPage, rowsPerPage));
            if (result?.content) {
                setFilteredProducts(convertDataProducts(result.content));
                setSearchPagination({
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    totalItems: result.totalItems
                });
            } else {
                setFilteredProducts([]);
                setSearchPagination({
                    totalPages: 1,
                    currentPage: 1,
                    totalItems: 0
                });
                toast.info("Không tìm thấy sản phẩm phù hợp");
            }
        } catch (error) {
            toast.error("Lỗi khi tìm kiếm sản phẩm: " + error.message);
        }
    };

    searchProducts();
  }, [debouncedSearchTerm, searchPage, dispatch, convertDataProducts, rowsPerPage]);

  const handleEdit = useCallback((product) => {
    setSelectedProduct(product);
    setOpenEditDialog(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
  }, []);

  const handleSave = useCallback(async (formData) => {
    try {
      await dispatch(updateProduct(formData.get('id'), formData));
      toast.success("Cập nhật sản phẩm thành công");
      setOpenEditDialog(false);
      setPage(1);
      fetchAllProducts(1);
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
        setPage(1); // Reset về page 1
        await fetchAllProducts(1); // Fetch data trang 1
      } catch (error) {
        toast.error("Xóa không thành công sản phẩm với id " + productToDelete);
      }
    }
    handleCloseDeleteDialog();
  }, [dispatch, fetchAllProducts, productToDelete]);

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
    setSearchPage(1);
  }, []);

  const handleOpenAddDialog = useCallback(() => {
    setOpenAddDialog(true);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setOpenAddDialog(false);
  }, [fetchAllProducts]);

  const handleProductCreated = useCallback(() => {
    setPage(1); // Reset về page 1
    fetchAllProducts(1); // Fetch data trang 1
  }, [fetchAllProducts]);

  const handlePageChange = useCallback((event, newPage) => {
    if (isSearching) {
        setSearchPage(newPage);
    } else {
        setPage(newPage);
        fetchAllProducts(newPage);
    }
}, [isSearching, fetchAllProducts]);

  const handleSortChange = (event) => {
    setSort(event.target.value);
    const data = {
      topLevelCategory: topLevel,
      secondLevelCategory: secondLevel,
      thirdLevelCategory: thirdLevel,
      colors: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 100000000000,
      minDiscount: 0,
      sort: event.target.value,
      pageNumber: page,
      pageSize: rowsPerPage,
      stock: stockFilter
    };
    dispatch(findProducts(data));
  };

  const handleTopLevelChange = (event) => {
    setTopLevel(event.target.value);
    setSecondLevel("");
    setThirdLevel("");
  };

  const handleSecondLevelChange = (event) => {
    setSecondLevel(event.target.value);
    setThirdLevel("");
  };

  const handleThirdLevelChange = (event) => {
    setThirdLevel(event.target.value);
  };

  const handleStockChange = (event) => {
    setStockFilter(event.target.value);
  };

  // Style chung cho tất cả InputLabel
  const commonInputLabelStyle = {
    color: colors.grey[100],
    '&.MuiInputLabel-shrink': {
      backgroundColor: 'transparent !important'
    },
    '&.Mui-focused': {
      color: `${colors.grey[100]} !important`,
    },
    
  };

  return (
    <>
      <Box m="5px">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Header title="SẢN PHẨM" subtitle="Quản lý sản phẩm" />
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
        </Box>

        <Box 
          display="flex" 
          gap={2} 
          mb={2}
          alignItems="center"
          sx={{
            '& .MuiFormControl-root': {
              flex: 1,
              maxWidth: '200px',
            }
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              fontSize: "14px",
              padding: "8px 16px",
              textTransform: "none",
              '&:hover': {
                backgroundColor: colors.greenAccent[700],
              }
            }}
          >
            Thêm mới sản phẩm
          </Button>

          <FormControl>
            <InputLabel 
              id="top-level-label"
              sx={commonInputLabelStyle}
            >
              Danh mục cấp 1
            </InputLabel>
            <Select
              labelId="top-level-label"
              value={topLevel}
              onChange={handleTopLevelChange}
              label="Danh mục cấp 1"
              sx={{
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '& .MuiSvgIcon-root': {
                  color: `${colors.grey[100]} !important`
                }
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categories?.topLevelCategories?.map((cat) => (
                <MenuItem key={cat._id} value={cat.slugCategory}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel 
              id="second-level-label"
              sx={commonInputLabelStyle}
            >
              Danh mục cấp 2
            </InputLabel>
            <Select
              labelId="second-level-label"
              value={secondLevel}
              onChange={handleSecondLevelChange}
              label="Danh mục cấp 2"
              sx={{
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '& .MuiSvgIcon-root': {
                  color: `${colors.grey[100]} !important`
                }
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categories?.secondLevelCategories?.map((cat) => (
                <MenuItem key={cat._id} value={cat.slugCategory}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel 
              id="third-level-label"
              sx={commonInputLabelStyle}
            >
              Danh mục cấp 3
            </InputLabel>
            <Select
              labelId="third-level-label"
              value={thirdLevel}
              onChange={handleThirdLevelChange}
              label="Danh mục cấp 3"
              sx={{
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '& .MuiSvgIcon-root': {
                  color: `${colors.grey[100]} !important`
                }
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categories?.categories?.map((cat) => (
                <MenuItem key={cat._id} value={cat.slugCategory}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel 
              id="stock-select-label"
              sx={commonInputLabelStyle}
            >
              Tình trạng hàng
            </InputLabel>
            <Select
              labelId="stock-select-label"
              value={stockFilter}
              onChange={handleStockChange}
              label="Tình trạng hàng"
              sx={{
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '& .MuiSvgIcon-root': {
                  color: `${colors.grey[100]} !important`
                }
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="in_stock">Còn hàng</MenuItem>
              <MenuItem value="out_of_stock">Hết hàng</MenuItem>
              <MenuItem value="low_stock">Sắp hết hàng</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel 
              id="sort-select-label"
              sx={commonInputLabelStyle}
            >
              Sắp xếp
            </InputLabel>
            <Select
              labelId="sort-select-label"
              value={sort}
              onChange={handleSortChange}
              label="Sắp xếp"
              sx={{
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${colors.grey[100]} !important`
                },
                '& .MuiSvgIcon-root': {
                  color: `${colors.grey[100]} !important`
                }
              }}
            >
              <MenuItem value="">Mặc định</MenuItem>
              <MenuItem value="price_high">Giá cao đến thấp</MenuItem>
              <MenuItem value="price_low">Giá thấp đến cao</MenuItem>
              <MenuItem value="best_selling">Bán chạy nhất</MenuItem>
              <MenuItem value="newest">Mới nhất</MenuItem>
            </Select>
          </FormControl>
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
            rows={filteredProducts}
            columns={productColumns(colors, handleDeleteClick, handleEdit)}
            getRowId={(row) => row.id}
            hideFooter={true}
            autoHeight
          />

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
                count={isSearching ? searchPagination.totalPages : (product?.products?.totalPages || 1)}
                page={isSearching ? searchPage : page}
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

export default ProductsTable;
