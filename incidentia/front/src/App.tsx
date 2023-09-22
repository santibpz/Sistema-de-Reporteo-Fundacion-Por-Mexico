import {
  Admin,
  Resource,
  CustomRoutes
} from "react-admin";
import { i18nProvider } from "./i18nProvider";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import LoginPage from "./pages/LoginPage";
import Reporte from "./components/Reportes/Reporte";

import { Route } from 'react-router-dom';

import { ReporteShow } from "./components/Reportes/Reporte"

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
      <CustomRoutes>
            <Route path="reportes/show/:id" element={<ReporteShow />} />
      </CustomRoutes>
    </Admin>  
  )
}

