import Header from "../components/Header";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme/theme";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from '@mui/icons-material/Person';
import StatBox from "../components/StatBox";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllUsers } from "../../redux/AllUsers/Action";
import { findProducts } from "../../redux/Product/Action";

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
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
  const colors = tokens(theme.palette.mode);
  const {users, product} = useSelector((state) => state);
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(findProducts(data));
  }, [dispatch]);
  return (
    <Box m="20px">

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" /> 
      </Box>
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
            title={users.users.length - 1}
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
            title={product.products.length}
            subtitle="Sản phẩm"
            icon={
              <DashboardIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
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
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box> */}

      </Box>
    </Box>
  );
};

export default Dashboard;