import React from "react";
import {
  Admin,
  Resource,
  Menu,
  MenuItemLink,
  Layout,
  Sidebar,
} from "react-admin";
import { i18nProvider } from "./i18nProvider";
import { dataProvider } from "./dataProvider";
import authProvider from "./authProvider";
import LoginPage from "./pages/LoginPage";
import ChartPage from "./pages/ChartPage";
import ResourcePage from "./pages/ReportesPage"; // Asegúrate de importar ReportesPage desde la ubicación correcta

// Define tu menú personalizado
const CustomMenu = (props) => (
  <Menu {...props}>
    <MenuItemLink to="/chart" primaryText="Gráfico" />
    <MenuItemLink to="/reportes" primaryText="Reportes" />
  </Menu>
);

export const App = () => {
  return (
    <Admin
      loginPage={LoginPage}
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      layout={Layout}
    >
      <Sidebar>
        <CustomMenu />
      </Sidebar>
      <Resource name="chart" list={ChartPage} />
      <Resource name="reportes" list={ResourcePage} />
    </Admin>
  );
};

