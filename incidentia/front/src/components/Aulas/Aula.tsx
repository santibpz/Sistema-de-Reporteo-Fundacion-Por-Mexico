import { List } from "react-admin";
import Aulas from "./Aulas";

// componente que despliega la información de todos los reportes archivados
const AulaList = () => (
    <List>
      <Aulas />
    </List>
  );


export default {
    AulaList
}