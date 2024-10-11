import { Box, Typography, Chip } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const productColumns = (colors, handleDeleteClick, handleEdit) => {
    return [
        { 
            field: "id",
            headerName: "ID",
            flex: 0.5 
        },
        {
            field: "imageUrl",
            headerName: "Ảnh",
            flex: 0.75,
            renderCell: (params) => {
                const images = params.row.imageUrl;
        
                return (
                    Array.isArray(images) && images.length > 0 ? (
                        <Box 
                            display="flex" 
                            alignItems="center"
                            justifyContent="flex-start"
                            height="100%"
                            width="100%"
                        >
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.image}
                                    alt={`${params.row.title} - ${img.color}`}
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        borderRadius: "50%",
                                        marginRight: index !== images.length - 1 ? "5px" : "0",
                                    }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography>Không có ảnh</Typography>
                    )
                );
            },
        },
        {
            field: "title",
            headerName: "Tên sản phẩm",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "brand",
            headerName: "Thương hiệu",
            flex: 0.5,
            cellClassName: "name-column--cell",
        },
        {
            field: "category",
            headerName: "Danh mục",
            flex: 0.75,
            renderCell: (params) => (
                <Box>
                    <Chip 
                        label={params.row.category.thirdLevelCategory} 
                        style={{ margin: '2px', backgroundColor: colors.greenAccent[700] }}
                    />
                </Box>
            ),
        },
        {
            field: "sizes",
            headerName: "Kích thước và Màu sắc",
            flex: 1,
            renderCell: (params) => (
                <Box>
                    {params.row.sizes.map((size, index) => (
                        <Chip 
                            key={index} 
                            label={`${size.size}: ${size.colors.map(c => c.color).join(', ')}`} 
                            style={{ margin: '2px' }}
                        />
                    ))}
                </Box>
            ),
        },
        {
            field: "price",
            headerName: "Giá gốc",
            flex: 0.45,
            cellClassName: "name-column--cell",
        },
        {
            field: "discountedPrice",
            headerName: "Giá sale",
            flex: 0.45,
            cellClassName: "name-column--cell",
        },
        {
            field: "discountedPersent",
            headerName: "%",
            flex: 0.25,
            cellClassName: "name-column--cell",
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            flex: 0.75,
            renderCell: (params) => ( 
                <>
                    <IconButton onClick={() => handleEdit(params.row)} size="large">
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.row.id)} size="large">
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </>             
            )
        },
    ];
}

export default productColumns;