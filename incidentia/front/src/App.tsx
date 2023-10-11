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
import Registrarse from "./registrarse";
import ChartPage from "./pages/ChartPage";
import { MyAppBar } from './MyAppBar';
import { lightTheme, darkTheme } from './theme/themes.js';

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

      <Resource 
       name="reportes" 
       list={Reporte.ReporteList} 
       create = {Reporte.ReporteCreate} 
        />  
      <Resource 
       name="ChartPage" 
       list={ChartPage} 
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

