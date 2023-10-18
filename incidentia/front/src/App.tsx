
import React, {useState} from 'react';
import { Route } from 'react-router-dom';
import { Admin, CustomRoutes, Layout, Resource, ListGuesser, NotFound, usePermissions } from 'react-admin';
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
import { DisableColorsProvider } from './theme/DisableColorContext';
import Aula from "./components/Aulas/Aula"
import CoordinadorCreate from "./components/Registro";
import { Registro } from "./components/Registro";
import Dashboard from './components/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { CoordinadoresList } from './components/List/coordinadoresList';

export const App = () => {
  const layout = (props: any) => <Layout {...props} appBar={MyAppBar} />;

  return (
    <DisableColorsProvider>
    <Admin
      loginPage={LoginPage}
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      layout={layout}
      theme = {theme}
      darkTheme = {darkTheme} 
      >

  {permissions => (
              <>
                  {permissions === 'Ejecutivo'
                      ? (<Resource
                          name="dashboard"
                          list={Dashboard}
                       />)
                      : null}
                      
                  {permissions === 'Ejecutivo'
                      ? (<Resource
                          name="coordinadores"
                          list={CoordinadoresList}
                          create={CoordinadorCreate}
                          icon={PersonIcon}
                       />)
                      : null}

                  {(permissions === 'Ejecutivo' || permissions === 'Nacional')
                      ? (<Resource
                          name="aulas"
                          list={Aula.AulaList}
                          icon={SchoolIcon}
                       />)
                      : null}


      <Resource 
       name="reportes" 
       list={ Reporte.ReporteList} 
       create = { permissions === 'Aula' ? (Reporte.ReporteCreate) : null } 
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
            <Route path="/coordinadores/create"  element={permissions === 'Ejecutivo' ? <Registro />: <NotFound />}/>
      </CustomRoutes>
              </>
          )
          
          }
  
    </Admin>
    </DisableColorsProvider>
  );
};