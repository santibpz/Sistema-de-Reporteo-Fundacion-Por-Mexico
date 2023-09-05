import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { i18nProvider } from "./i18nProvider";
import { dataProvider } from "./dataProvider";

export const App = () => {
  return(
    <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
      <Resource name="test" list={ListGuesser} />
    </Admin>
  )
}

