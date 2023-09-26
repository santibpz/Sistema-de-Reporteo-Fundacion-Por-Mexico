import React from "react";
import {
  Admin,
  Resource,
  Menu,
  MenuItemLink,
  Layout,
  Sidebar,
  CustomRoutes
} from "react-admin";
import { i18nProvider } from "./i18nProvider";
import { dataProvider } from "./dataProvider";
import authProvider from "./authProvider";
import LoginPage from "./pages/LoginPage";
import ChartPage from "./pages/ChartPage";
import Reporte from "./components/Reportes/Reporte";
import { Route } from 'react-router-dom';
import { ReporteShow } from "./components/Reportes/Reporte"
const CRoutes = [
            
                ];

//hola
export const App = () => {

  return(
    <Admin 
      loginPage = {LoginPage} 
      dataProvider={dataProvider} 
      authProvider = {authProvider}
      i18nProvider={i18nProvider}
      >

      <Resource 
       name="reportes" 
       list={Reporte.ReporteList} 
       create = {Reporte.ReporteCreate} 
      />

      <Resource
      name="chart"
      list={ChartPage}
      />

      <CustomRoutes>
         < Route path="reportes/show/:id" Component={ReporteShow} />,
         < Route path="chart" Component={ChartPage} />
      </CustomRoutes>
    </Admin>  
  )
}