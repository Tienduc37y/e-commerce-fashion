import Topbar from "../components/global/TopBar";
import SidebarMenu from "../components/global/SidebarMenu";
import {  Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from "../theme/theme";
import AuthMiddleware from "../../middleware/AuthMiddleware";


const App = () => {

  const [theme, coloMode] = useMode();

  return (
    <ColorModeContext.Provider value={coloMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <main className="app">

            <SidebarMenu />

            <section className="content">
              <Topbar />
              <Outlet/>
            </section>

          </main>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App