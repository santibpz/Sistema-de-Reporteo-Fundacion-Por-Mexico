import React, {useState} from 'react';
import { Route } from 'react-router-dom';
import { Admin, CustomRoutes, Layout, Resource } from 'react-admin';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArchiveIcon from '@mui/icons-material/Archive';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { dataProvider } from './dataProvider';
import { i18nProvider } from './i18nProvider';
import authProvider from './authProvider';
import ChartPage from './pages/ChartPage';
import LoginPage from './pages/LoginPage';
import { MyAppBar } from './theme/MyAppBar';
import { darkTheme, theme } from './theme/themes';
import Reporte, { ReporteShow } from './components/Reportes/Reporte';
import ReporteArchivado from './components/ReportesArchivados/ReporteArchivado';
import Registrarse from './registrarse';
import { DisableColorsProvider } from './theme/DisableColorContext';

export const App = () => {
  const layout = (props: any) => <Layout {...props} appBar={MyAppBar} />;

  const [disableColors, setDisableColors] = useState(false);

  const handleDisableColorsToggle = () => {
    setDisableColors(!disableColors);
  };

  return (
    <DisableColorsProvider>
    <Admin
      loginPage={LoginPage}
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      theme={theme}
      darkTheme={darkTheme}
      layout={layout}
    >

        <Resource
          name="reportes"
          list={Reporte.ReporteList}
          create={Reporte.ReporteCreate}
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
          <Route path="/registrarse" element={<Registrarse />} />
        </CustomRoutes>
      
    </Admin>
    </DisableColorsProvider>
  );
};