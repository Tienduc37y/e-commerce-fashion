import Header from "../components/Header";
import { Box, Typography, useTheme, Avatar, Rating, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { tokens } from "../theme/theme";
import ClothesIcon from "../components/global/ClothesIcon";
import PersonIcon from '@mui/icons-material/Person';
import StatBox from "../components/StatBox";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getAllUsers } from "../../redux/AllUsers/Action";
import { findProducts } from "../../redux/Product/Action";
import { getOrderStatistics } from "../../redux/Order/Action";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { convertCurrency } from "../../common/convertCurrency";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const { users, product, order } = useSelector((state) => state);
  const orderStats = order.statistics?.orders || {};
  const revenueStats = order.statistics?.revenue || {};
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getAllUsers()),
          dispatch(findProducts({
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
            pageSize: 1000,
            stock: ""
          })),
          dispatch(getOrderStatistics())
        ]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    
    fetchData();
  }, [dispatch]);

  // Thêm data cho biểu đồ tròn
  const orderStatusData = [
    { name: 'Đã hoàn thành', value: parseFloat(orderStats.orderStatusRates?.completed || 0) },
    { name: 'Đã hủy', value: parseFloat(orderStats.orderStatusRates?.canceled || 0) },
    { name: 'Hoàn trả', value: parseFloat(orderStats.orderStatusRates?.refunded || 0) },
    { name: 'Đang xử lý', value: parseFloat(orderStats.orderStatusRates?.processing || 0) },
  ];

  // Màu sc cho từng trạng thái
  const COLORS = [colors.greenAccent[500], colors.redAccent[500], colors.blueAccent[500], colors.grey[500]];

  // Thêm state để lưu năm được chọn
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Tạo danh sách các năm từ dữ liệu
  const availableYears = useMemo(() => {
    if (!revenueStats.daily) return [];
    
    const years = revenueStats.daily.map(item => 
      new Date(item.date).getFullYear()
    );
    return [...new Set(years)].sort((a, b) => b - a); // Sắp xếp giảm dần
  }, [revenueStats.daily]);

  // Lọc dữ liệu theo năm đã chọn
  const filteredDailyData = useMemo(() => {
    if (!revenueStats.daily) return [];
    
    return revenueStats.daily.filter(item => 
      new Date(item.date).getFullYear() === selectedYear
    );
  }, [revenueStats.daily, selectedYear]);

  // Thêm hàm xử lý thay đổi năm
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Bảng điều khiển" /> 
      </Box>

      {/* Stats Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={convertCurrency(revenueStats.total || 0)}
            subtitle="Tổng doanh thu"
            icon={
              <MonetizationOnIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={convertCurrency(revenueStats.currentMonth?.total || 0)}
            subtitle={`Doanh thu tháng này (${revenueStats.currentMonth?.orderCount || 0} đơn)`}
            icon={
              <TrendingUpIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={users.users?.pagination?.totalItems}
            subtitle="Người dùng"
            icon={
              <PersonIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={product.products?.totalProducts}
            subtitle="Loại Sản phẩm"
            icon={
              <ClothesIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        mt="25px"
      >

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={product.products?.totalQuantity || 0}
            subtitle="Tổng sản phẩm trong kho"
            icon={
              <ClothesIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={order.statistics?.orders?.total || 0}
            subtitle="Tổng số đơn hàng"
            icon={
              <ReceiptOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={order.statistics?.orders?.completed || 0}
            subtitle="Đơn hàng hoàn thành"
            icon={
              <ReceiptOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={order.statistics?.orders?.total - order.statistics?.orders?.completed || 0}
            subtitle="Đơn hàng đang xử lý"
            icon={
              <ReceiptOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

      </Box>

      {/* Top Products Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gap="10px"
        mt="25px"
      >
        {/* Top Selling Products */}
        <Box
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="4px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            mb="20px"
          >
            Top Sản Phẩm Bán Chạy
          </Typography>
          <Box
            sx={{
              height: "600px",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px"
              },
              "&::-webkit-scrollbar-track": {
                background: colors.primary[400]
              },
              "&::-webkit-scrollbar-thumb": {
                background: colors.grey[500],
                borderRadius: "4px"
              }
            }}
          >
            {order.statistics?.topProducts?.selling.map((product, index) => (
              <Box
                key={product.id}
                display="flex"
                alignItems="center"
                p="15px"
                borderBottom={`1px solid ${colors.primary[300]}`}
              >
                <Box
                  width="40px"
                  height="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={colors.primary[700]}
                  borderRadius="50%"
                  mr="15px"
                >
                  <Typography color={theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900]} fontWeight="bold">
                    {index + 1}
                  </Typography>
                </Box>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    objectPosition: "top",
                    borderRadius: "4px",
                    marginRight: "15px"
                  }}
                />
                <Box flex="1">
                  <Typography color={colors.grey[100]} mb="5px">
                    {product.title}
                  </Typography>
                  <Typography color={colors.greenAccent[500]}>
                    {convertCurrency(product.discountedPrice)} | Đã bán: {product.sellQuantity}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Top Users */}
        <Box
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="4px"
        >
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="20px">
            Top Khách Hàng Mua Nhiều
          </Typography>
          <Box sx={{ height: "600px", overflow: "auto", /* ... các style khác ... */ }}>
            {order.statistics?.topUsers?.map((user, index) => (
              <Box
                key={user.id}
                display="flex"
                alignItems="center"
                p="15px"
                borderBottom={`1px solid ${colors.primary[300]}`}
              >
                <Box
                  width="40px"
                  height="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={colors.primary[700]}
                  borderRadius="50%"
                  mr="15px"
                >
                  <Typography color={theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900]} fontWeight="bold">
                    {index + 1}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: colors.greenAccent[500],
                    width: 50,
                    height: 50,
                    mr: "15px",
                    fontSize: "1.2rem"
                  }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box flex="1">
                  <Typography color={colors.grey[100]} mb="5px">
                    {user.username}
                  </Typography>
                  <Typography color={colors.greenAccent[500]}>
                    SĐT: {user.mobile || "Chưa cập nhật"} | Số đơn: {user.orderCount}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Most Viewed và Low Stock Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gap="10px"
        mt="25px"
      >
        {/* Most Viewed Products */}
        <Box
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="4px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            mb="20px"
          >
            Top Sản Phẩm Xem Nhiều
          </Typography>
          <Box
            sx={{
              height: "600px",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px"
              },
              "&::-webkit-scrollbar-track": {
                background: colors.primary[400]
              },
              "&::-webkit-scrollbar-thumb": {
                background: colors.grey[500],
                borderRadius: "4px"
              }
            }}
          >
            {order.statistics?.topProducts?.viewed.map((product, index) => (
              <Box
                key={product.id}
                display="flex"
                alignItems="center"
                p="15px"
                borderBottom={`1px solid ${colors.primary[300]}`}
              >
                <Box
                  width="40px"
                  height="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={colors.primary[700]}
                  borderRadius="50%"
                  mr="15px"
                >
                  <Typography color={theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900]} fontWeight="bold">
                    {index + 1}
                  </Typography>
                </Box>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectPosition: "top",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginRight: "15px"
                  }}
                />
                <Box flex="1">
                  <Typography color={colors.grey[100]} mb="5px">
                    {product.title}
                  </Typography>
                  <Typography color={colors.greenAccent[500]}>
                    {product.view || 0} lượt xem
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Low Stock Products */}
        <Box
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="4px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            mb="20px"
          >
            Sản Phẩm Sắp Hết Hàng
          </Typography>
          <Box
            sx={{
              height: "600px",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px"
              },
              "&::-webkit-scrollbar-track": {
                background: colors.primary[400]
              },
              "&::-webkit-scrollbar-thumb": {
                background: colors.grey[500],
                borderRadius: "4px"
              }
            }}
          >
            {order.statistics?.topProducts?.lowStock.map((product, index) => (
              <Box
                key={`${product.productId}-${product.color}-${product.size}`}
                display="flex"
                alignItems="center"
                p="15px"
                borderBottom={`1px solid ${colors.primary[300]}`}
              >
                <Box
                  width="40px"
                  height="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={colors.primary[700]}
                  borderRadius="50%"
                  mr="15px"
                >
                  <Typography color={theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900]} fontWeight="bold">
                    {index + 1}
                  </Typography>
                </Box>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    objectPosition: "top",
                    borderRadius: "4px",
                    marginRight: "15px"
                  }}
                />
                <Box flex="1">
                  <Typography color={colors.grey[100]} mb="5px">
                    {product.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Thêm container cho 2 box */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gap="20px"
        mt="25px"
      >
        {/* Box biểu đồ tròn */}
        <Box
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="4px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            mb="20px"
          >
            Các Đơn Hàng
          </Typography>
          <Box height="400px" display="flex" flexDirection="column" alignItems="center">
            <PieChart margin={{ top: 25 }} width={400} height={350}>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="45%"
                labelLine={true}
                label={({ name, value }) => `${value}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke={colors.primary[400]}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.primary[400],
                  border: `1px solid ${colors.grey[100]}`,
                  borderRadius: '4px',
                  color: colors.grey[100]
                }}
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ 
                    color: colors.grey[100],
                    fontSize: '0.9rem',
                    padding: '0 2px'
                  }}>
                    {value}
                  </span>
                )}
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
            </PieChart>
          </Box>
        </Box>

        {/* Box bảng doanh thu theo tháng */}
        <Box
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="4px"
          height="500px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            mb="20px"
          >
            Doanh Thu Theo Tháng
          </Typography>
          <Box
            sx={{
              height: "calc(100% - 60px)",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px"
              },
              "&::-webkit-scrollbar-track": {
                background: colors.primary[400]
              },
              "&::-webkit-scrollbar-thumb": {
                background: colors.grey[500],
                borderRadius: "4px"
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: colors.grey[400]
              }
            }}
          >
            <table style={{ 
              width: "100%", 
              borderCollapse: "separate", 
              borderSpacing: "0"
            }}>
              <thead style={{ 
                position: "sticky", 
                top: 0, 
                zIndex: 1,
                backgroundColor: colors.primary[400]
              }}>
                <tr>
                  <th style={{ 
                    padding: "16px", 
                    textAlign: "left", 
                    backgroundColor: colors.primary[400],
                    borderBottom: `2px solid ${colors.grey[100]}`,
                    color: colors.grey[100],
                    fontWeight: "600",
                    fontSize: "0.9rem"
                  }}>
                    Tháng
                  </th>
                  <th style={{ 
                    padding: "16px", 
                    textAlign: "right",
                    backgroundColor: colors.primary[400],
                    borderBottom: `2px solid ${colors.grey[100]}`,
                    color: colors.grey[100],
                    fontWeight: "600",
                    fontSize: "0.9rem"
                  }}>
                    Doanh Thu
                  </th>
                  <th style={{ 
                    padding: "16px", 
                    textAlign: "right",
                    backgroundColor: colors.primary[400],
                    borderBottom: `2px solid ${colors.grey[100]}`,
                    color: colors.grey[100],
                    fontWeight: "600",
                    fontSize: "0.9rem"
                  }}>
                    Số Đơn
                  </th>
                </tr>
              </thead>
              <tbody>
                {revenueStats.monthly?.map((item, index) => (
                  <tr 
                  key={item.month}
                  style={{
                    backgroundColor: colors.primary[400], // Chỉ để một màu nền duy nhất
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: colors.primary[300]
                    }
                  }}
                >
                    <td style={{ 
                      padding: "16px", 
                      textAlign: "left",
                      color: colors.grey[100],
                      borderBottom: `1px solid ${colors.primary[300]}`,
                      fontSize: "0.9rem"
                    }}>
                      {new Date(item.month).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' })}
                    </td>
                    <td style={{ 
                      padding: "16px", 
                      textAlign: "right",
                      color: colors.greenAccent[300],
                      borderBottom: `1px solid ${colors.primary[300]}`,
                      fontSize: "0.9rem",
                      fontWeight: "600"
                    }}>
                      {convertCurrency(item.revenue)}
                    </td>
                    <td style={{ 
                      padding: "16px", 
                      textAlign: "right",
                      color: colors.grey[100],
                      borderBottom: `1px solid ${colors.primary[300]}`,
                      fontSize: "0.9rem"
                    }}>
                      {item.orderCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>

      {/* Daily Revenue Chart */}
      <Box
        gridColumn="span 12"
        backgroundColor={colors.primary[400]}
        p="30px"
        mt="25px"
        borderRadius="4px"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
          >
            Biểu Đồ Doanh Thu Theo Ngày
          </Typography>

          {/* Thêm bộ lọc năm */}
          <FormControl 
            variant="outlined" 
            size="small"
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                color: colors.grey[100],
                '& fieldset': {
                  borderColor: colors.grey[100],
                },
                '&:hover fieldset': {
                  borderColor: colors.grey[100],
                },
              },
              '& .MuiInputLabel-root': {
                color: colors.grey[100],
              },
              '& .MuiSelect-select': {
                color: colors.grey[100],
              }
            }}
          >
            <InputLabel id="year-select-label">Năm</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              onChange={handleYearChange}
              label="Năm"
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: colors.primary[900],
                    '& .MuiMenuItem-root': {
                      color: colors.grey[100],
                      '&:hover': {
                        bgcolor: colors.grey[800],
                      },
                      '&.Mui-selected': {
                        bgcolor: colors.grey[600],
                        '&:hover': {
                          bgcolor: colors.grey[900],
                        }
                      }
                    }
                  }
                }
              }}
            >
              {availableYears.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box height="400px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredDailyData}
              margin={{
                top: 20,
                right: 30,
                left: 60,
                bottom: 60,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={colors.grey[500]}
                opacity={0.2}
              />
              <XAxis 
                dataKey="date"
                stroke={colors.grey[100]}
                angle={-45}
                textAnchor="end"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
                height={60}
                // Thêm cấu hình để xử lý nhiều dữ liệu
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                stroke={colors.grey[100]}
                tickFormatter={(value) => convertCurrency(value)}
                domain={[0, 'dataMax + 1000000']}
                width={100}
                style={{
                  fontSize: '0.8rem'
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.primary[400],
                  border: `1px solid ${colors.grey[100]}`,
                  borderRadius: '4px',
                  color: colors.grey[100]
                }}
                formatter={(value, name) => {
                  if (name === "revenue") {
                    return [convertCurrency(value), "Doanh thu"];
                  }
                  return [value, "Số đơn hàng"];
                }}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return `Ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue"
                name="Doanh thu"
                stroke={colors.greenAccent[500]}
                strokeWidth={2}
                dot={false} // Tắt hiển thị dot khi có nhiều dữ liệu
                activeDot={{
                  r: 8,
                  fill: colors.greenAccent[300],
                  strokeWidth: 0
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Latest Reviews Section */}
      <Box
        gridColumn="span 12"
        backgroundColor={colors.primary[400]}
        p="30px"
        mt="25px"
        borderRadius="4px"
      >
        <Typography
          variant="h5"
          fontWeight="600"
          color={colors.grey[100]}
          mb="20px"
        >
          Đánh Giá Mới Nhất
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr"
            },
            gap: "20px",
            maxHeight: "500px",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "8px"
            },
            "&::-webkit-scrollbar-track": {
              background: colors.primary[400]
            },
            "&::-webkit-scrollbar-thumb": {
              background: colors.grey[500],
              borderRadius: "4px"
            }
          }}
        >
          {order.statistics?.latestReviews?.map((review) => (
            <Box
              key={review.id}
              backgroundColor={theme.palette.mode === "dark" ? colors.primary[500] : colors.grey[900]}
              p="20px"
              borderRadius="4px"
              sx={{
                boxShadow: theme.palette.mode === "dark" ? "none" : "0px 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {/* User Info */}
              <Box display="flex" alignItems="center" mb="15px">
                <Avatar
                  sx={{
                    bgcolor: colors.greenAccent[500],
                    width: 32,
                    height: 32,
                    marginRight: "10px",
                    fontSize: "0.9rem"
                  }}
                >
                  {review.user.firstName?.charAt(0) || review.user.username?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography color={colors.grey[100]} fontSize="0.9rem" fontWeight="600">
                    {review.user.firstName 
                      ? `${review.user.firstName} ${review.user.lastName}`
                      : review.user.username}
                  </Typography>
                  <Typography color={colors.grey[300]} fontSize="0.75rem">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </Typography>
                </Box>
              </Box>

              {/* Product Info */}
              <Box 
                display="flex" 
                alignItems="center" 
                mb="10px"
              >
                <img
                  src={review.product.thumbnail}
                  alt={review.product.title}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    objectPosition: "top",
                    borderRadius: "4px",
                    marginRight: "10px"
                  }}
                />
                <Typography 
                  color={colors.grey[100]}
                  fontSize="0.85rem"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }}
                >
                  {review.product.title}
                </Typography>
              </Box>

              {/* Rating */}
              <Rating 
                value={review.rating} 
                readOnly
                size="small"
                sx={{
                  mb: "10px",
                  "& .MuiRating-iconFilled": {
                    color: colors.greenAccent[500]
                  }
                }}
              />

              {/* Review Content */}
              <Typography 
                color={colors.grey[100]}
                fontSize="0.85rem"
                sx={{
                  mb: "10px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                }}
              >
                Bình luận: {review.review}
              </Typography>

              {/* Review Images */}
              {review.images?.length > 0 && (
                <Box 
                  display="flex" 
                  gap="5px" 
                  flexWrap="wrap"
                  sx={{
                    maxHeight: "80px",
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                      width: "4px",
                      height: "4px"
                    },
                    "&::-webkit-scrollbar-track": {
                      background: colors.primary[400]
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: colors.grey[500],
                      borderRadius: "2px"
                    }
                  }}
                >
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      style={{
                        width: "45px",
                        height: "45px",
                        objectPosition: "top",
                        objectFit: "cover",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;