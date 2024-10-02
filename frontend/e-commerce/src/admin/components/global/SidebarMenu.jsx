import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { sidebarMenu } from "../../constants/sideBarMenu";
import { useLocation } from "react-router-dom";
import { tokens } from "../../theme/theme";
import { useState, useEffect } from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SidebarMenuItem from "./SidebarItem";
import 'react-pro-sidebar/dist/css/styles.css'
const SidebarMenu = () => {

  const location = useLocation();
  const urlPathName = location.pathname;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState(urlPathName);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
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
        ...(isMobile && {
          position: 'fixed',
          zIndex: 1000,
          height: '100%',
          '& .pro-sidebar': {
            width: isCollapsed ? '80px' : '250px',
            minWidth: isCollapsed ? '80px' : '250px',
          },
        }),
      }}
    >
      <ProSidebar collapsed={isCollapsed}>

        <Menu iconShape="square">

          {/* LOGO AND MENU ICON */}
          {/* 🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧 */}
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
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/304160329_189120553489433_140427851683381080_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeETaRHkLMkFZC2lii3STvA2K5BtOK198McrkG04rX3wx68XgbR1Vv7Iu9Cth0SI7xeK2KtOSk5dL_yQQZbbhuBq&_nc_ohc=ucLpR2dOeDUQ7kNvgHH6Hww&_nc_ht=scontent.fhan20-1.fna&_nc_gid=ApLDE6yfzeMbvozc63hJG6F&oh=00_AYB9QWrgfkjHO99_Ws7CmkRtxBPt2o8jbpUPcL3sG1A2hA&oe=66FEA84B`}
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