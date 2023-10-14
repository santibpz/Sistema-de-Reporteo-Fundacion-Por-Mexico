import React, { useState } from "react";
import {
  Admin,
  Layout,
  Resource,
  CustomRoutes,
  ListGuesser,
  NotFound
} from "react-admin";
import { Route } from 'react-router-dom';
import { i18nProvider } from "./i18nProvider";
import { dataProvider } from "./dataProvider";
import authProvider from "./authProvider";
import LoginPage from "./pages/LoginPage";
import Reporte, { ReporteShow } from "./components/Reportes/Reporte";
import ReporteArchivado from "./components/ReportesArchivados/ReporteArchivado";
import ChartPage from "./pages/ChartPage";
import { MyAppBar } from './MyAppBar';
import { lightTheme, darkTheme } from './theme/themes.js';

import CoordinadorCreate from "./components/Registro";
import { Registro } from "./components/Registro";


const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

export const App = () => {

  return(
    <Admin 
      loginPage = {LoginPage} 
      dataProvider={dataProvider} 
      authProvider = {authProvider} 
      i18nProvider={i18nProvider}
      layout={MyLayout}
      theme = {lightTheme}
      darkTheme = {darkTheme} 
      >

  {permissions => (
              <>
                  {permissions === 'Ejecutivo'
                      ? (<Resource
                          name="coordinadores"
                          list={ListGuesser}
                          create={CoordinadorCreate}
                       />)
                      : null}

<Resource 
       name="reportes" 
       list={Reporte.ReporteList} 
       create = {Reporte.ReporteCreate} 
        />  
        
      <Resource 
       name="archivados"
       list={ReporteArchivado.ReporteArchivadoList} 
        />  

      <Resource 
       name="ChartPage" 
       list={ChartPage} 
        />  

      <CustomRoutes>
            <Route path="reportes/show/:id" element={<ReporteShow />} />
            <Route path="/chart" element={<ChartPage />} />
      </CustomRoutes>
      <CustomRoutes>
        <Route path="/coordinadores/create"  element={permissions === 'Ejecutivo' ? <Registro />: <NotFound />}/>
      </CustomRoutes>
              </>
          )
          
          }

      
    </Admin>  
  )
}

