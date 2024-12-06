import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { sidebarMenu } from "../../constants/sideBarMenu";
import { useLocation, useNavigate } from "react-router-dom";
import { tokens, } from "../../theme/theme";
import { useState, useEffect } from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SidebarMenuItem from "./SidebarItem";
import 'react-pro-sidebar/dist/css/styles.css'
import { logout } from '../../../redux/Auth/Action';
import { useDispatch } from 'react-redux';

const SidebarMenu = ({ isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const urlPathName = location.pathname;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState(urlPathName);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile, setIsCollapsed]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); 
  };

  return (
    <Box
      sx={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        transition: 'width 0.3s ease-in-out',
        width: isCollapsed ? '80px' : '250px',
        "& .pro-sidebar": {
          width: '100% !important',
          minWidth: '100% !important',
        },
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          height: '100vh',
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>

        <Menu iconShape="square">

          {/* LOGO AND MENU ICON */}
          {/* 🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧 */}
          <MenuItem
            onClick={handleToggleSidebar}
            icon={<MenuOutlinedIcon />}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {
              !isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    ADMIN
                  </Typography>
                </Box>
              )
            }
          </MenuItem>

          {/* 🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧 */}
          {
            !isCollapsed && !isMobile && (
              <Box mb="25px">

                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="avatar-admin"
                    width="100px"
                    height="100px"
                    src='/logoadmin.jpg'
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>

                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    fontWeight="bold"
                    color={colors.grey[100]}
                    sx={{ m: "10px 0 0 0" }}
                  >
                    Admin
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    Admin đẹp trai
                  </Typography>
                </Box>

              </Box>
            )
          }

          {/* 🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧 */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {
              sidebarMenu.map(menu =>
                menu.tag === 'divider'
                  ? (
                    <Typography
                      variant="h6"
                      key={menu.title}
                      color={colors.grey[300]}
                      sx={{ m: "15px 0 5px 20px" }}
                    >
                      {!isCollapsed && menu.title}
                    </Typography>
                  )
                  : (
                    <SidebarMenuItem
                      key={menu.title}
                      menu={menu}
                      selected={selected}
                      setSelected={setSelected}
                      isCollapsed={isCollapsed}
                      onLogout={menu.action === 'logout' ? handleLogout : undefined}
                    />
                  )
              )
            }
          </Box>

        </Menu>

      </ProSidebar>
    </Box>
  );
};

export default SidebarMenu;
