import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { i18nProvider } from "./i18nProvider";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import LoginPage from "./pages/LoginPage";

export const App = () => {
  return(
    <Admin loginPage = {LoginPage} dataProvider={dataProvider} authProvider = {authProvider} i18nProvider={i18nProvider}>
      <Resource name="test" list={ListGuesser} />
    </Admin>
  )
}

