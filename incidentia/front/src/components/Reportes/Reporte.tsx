import { Create, List } from 'react-admin';
import Reportes from './Reportes';
import ReporteForm from '../ReporteForm';

// componente que despliega la información de todos los reportes
const ReporteList = () => (
    <List>
       <Reportes /> 
    </List>
);

// componente para crear nuevos reportes
const ReporteCreate = () => {
    return(
        <Create>
            <ReporteForm />
        </Create>
    )
}

export default {
    ReporteList,
    ReporteCreate
}