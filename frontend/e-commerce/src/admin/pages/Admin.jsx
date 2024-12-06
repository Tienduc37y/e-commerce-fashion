import Topbar from "../components/global/TopBar";
import SidebarMenu from "../components/global/SidebarMenu";
import {  Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { ColorModeContext, useMode } from "../theme/theme";
import { useState } from 'react';


const App = () => {
  const [theme, coloMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ColorModeContext.Provider value={coloMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', position: 'relative' }}>
          <SidebarMenu isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <Box 
            component="main" 
            sx={{
              flexGrow: 1,
              minHeight: '100vh',
              transition: 'all 0.3s ease-in-out',
              marginLeft: isCollapsed ? '80px' : '250px',
              width: isCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 250px)',
            }}
          >
            <Topbar />
            <Box sx={{ p: 2 }}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
