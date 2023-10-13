import React, { useState } from "react";
import {
  Admin,
  Layout,
  Resource,
  CustomRoutes
} from "react-admin";
import { Route } from 'react-router-dom';
import { i18nProvider } from "./i18nProvider";
import { dataProvider } from "./dataProvider";
import authProvider from "./authProvider";
import LoginPage from "./pages/LoginPage";
import Reporte, { ReporteShow } from "./components/Reportes/Reporte";
import ReporteArchivado from "./components/ReportesArchivados/ReporteArchivado";
import Registrarse from "./registrarse";
import ChartPage from "./pages/ChartPage";
import { MyAppBar } from './MyAppBar';
import { lightTheme, darkTheme, handleThemeChange } from './theme/themes.js';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArchiveIcon from '@mui/icons-material/Archive';
import AssignmentIcon from '@mui/icons-material/Assignment';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

export const App = () => {

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const theme = isDarkTheme ? darkTheme : lightTheme;

  return(
    <Admin 
      loginPage = {LoginPage} 
      dataProvider={dataProvider} 
      authProvider = {authProvider} 
      i18nProvider={i18nProvider}
      layout={MyLayout}
      theme={theme}
      darkTheme={darkTheme}
      >
      <MyAppBar isDarkTheme={isDarkTheme} onThemeToggle={handleThemeToggle} />

      <Resource 
       name="reportes" 
       list={Reporte.ReporteList} 
       create = {Reporte.ReporteCreate} 
       icon={AssignmentIcon}
        />  

      <Resource 
       name="archivados"
       list={ReporteArchivado.ReporteArchivadoList} 
       icon={ArchiveIcon} 
        />  

      <Resource 
       name="ChartPage" 
       list={ChartPage} 
       icon={BarChartIcon}
        />  

      <CustomRoutes>
            <Route path="reportes/show/:id" element={<ReporteShow />} />
            <Route path="/chart" element={<ChartPage />} />
      </CustomRoutes>
      <CustomRoutes noLayout>
        <Route path="/registrarse"  element={<Registrarse />}/>
      </CustomRoutes>
    </Admin>  
  )
}

