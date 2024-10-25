import { Box, Typography, Chip, Tooltip } from "@mui/material";
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
            field: "productImage",
            headerName: "Ảnh",
            flex: 0.75,
            renderCell: (params) => {
                const variants = params.row.variants;
        
                return (
                    Array.isArray(variants) && variants.length > 0 ? (
                        <Box 
                            display="flex" 
                            alignItems="center"
                            justifyContent="flex-start"
                            height="100%"
                            width="100%"
                        >
                            {variants.map((variant, index) => (
                                <Tooltip key={index} title={variant.nameColor}>
                                    <img
                                        src={variant.imageUrl}
                                        alt={`${params.row.title} - ${variant.nameColor}`}
                                        style={{
                                            width: "35px",
                                            height: "35px",
                                            borderRadius: "50%",
                                            marginRight: index !== variants.length - 1 ? "5px" : "0",
                                            objectFit: "cover"
                                        }}
                                    />
                                </Tooltip>
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
            field: "variantInfo",
            headerName: "Màu sắc và kích thước",
            flex: 1,
            renderCell: (params) => (
                <Box>
                    {params.row.variants.map((variant, index) => (
                        <Tooltip key={index} title={`Số lượng: ${variant.sizes.reduce((acc, size) => acc + size.quantityItem, 0)}`}>
                            <Chip 
                                label={`${variant.nameColor}: ${variant.sizes.map(s => s.size).join(', ')}`} 
                                style={{ margin: '2px' }}
                            />
                        </Tooltip>
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
            field: "quantity",
            headerName: "Tổng số lượng",
            flex: 0.35,
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
