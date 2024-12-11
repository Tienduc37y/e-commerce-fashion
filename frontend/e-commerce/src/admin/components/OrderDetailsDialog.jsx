import {
  Dialog,
  DialogContent,
  Grid,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
  Paper
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { convertCurrency } from "../../common/convertCurrency";

const OrderDetailsDialog = ({ open, handleClose, orderData }) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#1F2A40'
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600} color="white">
            Chi tiết đơn hàng #{orderData?._id}
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ bgcolor: '#1F2A40' }}>
        <Grid container spacing={3}>
          {/* Thông tin khách hàng */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#283593', color: 'white' }}>
              <Typography variant="h6" gutterBottom>Thông tin khách hàng</Typography>
              <Stack spacing={1}>
                <Typography>
                  Họ tên: {orderData?.user?.firstName} {orderData?.user?.lastName}
                </Typography>
                <Typography>Email: {orderData?.user?.email}</Typography>
                <Typography>Username: {orderData?.user?.username}</Typography>
              </Stack>
            </Paper>
          </Grid>

          {/* Thông tin giao hàng */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#283593', color: 'white' }}>
              <Typography variant="h6" gutterBottom>Địa chỉ giao hàng</Typography>
              <Stack spacing={1}>
                <Typography>
                  {orderData?.shippingAddress?.address?.streetAddress},&nbsp;
                  {orderData?.shippingAddress?.address?.ward},&nbsp;
                  {orderData?.shippingAddress?.address?.district},&nbsp;
                  {orderData?.shippingAddress?.address?.city}
                </Typography>
                <Typography>
                  SĐT: {orderData?.shippingAddress?.address?.mobile}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          {/* Thông tin thanh toán */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#283593', color: 'white' }}>
              <Typography variant="h6" gutterBottom>Thông tin thanh toán</Typography>
              <Stack spacing={1}>
                <Typography>
                  Phương thức: {orderData?.paymentDetails?.paymentMethod}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography>Trạng thái:</Typography>
                  <Chip 
                    label={orderData?.paymentDetails?.paymentStatus}
                    color={orderData?.paymentDetails?.paymentStatus === "Đã thanh toán" ? "success" : "error"}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
                {orderData?.paymentDetails?.zalopayTransactionId && (
                  <Typography>
                    Mã GD: {orderData?.paymentDetails?.zalopayTransactionId}
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Danh sách sản phẩm */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#283593', color: 'white' }}>
              <Typography variant="h6" gutterBottom>Sản phẩm</Typography>
              <Stack spacing={2}>
                {orderData?.orderItems?.map((item, index) => (
                  <Paper 
                    key={index} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 1
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <Box
                          component="img"
                          src={item?.product?.variants[0]?.imageUrl}
                          alt={item?.product?.title}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 1
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {item?.product?.title || 'Sản phẩm đã xóa'}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip label={`Size: ${item.size}`} size="small" />
                            <Chip label={`Màu: ${item.color}`} size="small" />
                            <Chip label={`SL: ${item.quantity}`} size="small" />
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Stack spacing={1} alignItems="flex-end">
                          <Typography color="text.secondary" sx={{textDecoration: 'line-through'}}>
                            {convertCurrency(item.price)}
                          </Typography>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {convertCurrency(item.discountedPrice)}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Tổng tiền */}
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Tổng tiền hàng</Typography>
                  <Typography>{convertCurrency(orderData?.totalPrice)}</Typography>
                </Stack>

                {/* Hiển thị tổng giảm giá (từ sản phẩm) nếu có */}
                {orderData?.discounte > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Giảm giá sản phẩm</Typography>
                    <Typography>{convertCurrency(orderData?.discounte)}</Typography>
                  </Stack>
                )}

                {/* Hiển thị thông tin promotion nếu có */}
                {orderData?.promotion && (
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>Mã giảm giá:</Typography>
                      <Chip 
                        label={orderData.promotion.code}
                        size="small"
                        color="secondary"
                      />
                      <Typography variant="caption" color="grey.300">
                        ({orderData.promotion.description})
                      </Typography>
                    </Stack>
                    <Typography>
                      {convertCurrency(orderData.discountCode)}
                    </Typography>
                  </Stack>
                )}


                <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'primary.light' }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Thành tiền</Typography>
                    <Typography variant="h6">
                      {convertCurrency(orderData?.totalDiscountedPrice)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog; 