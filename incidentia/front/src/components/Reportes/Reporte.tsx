import { Create, List, Show } from 'react-admin';
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

// componente para mostrar los reportes completos reportes
const ReporteShow = () => {
    return(
        <Show>
            
        </Show>
    )
}

export default {
    ReporteList,
    ReporteCreate,
    ReporteShow
}