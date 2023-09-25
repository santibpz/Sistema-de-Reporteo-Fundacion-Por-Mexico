import React from 'react';
import {
  Resource,
  ShowGuesser,
} from 'react-admin';
import Reporte from '../components/Reportes/Reporte'; 

const ResourcePage = () => {
  return (
    <div>
      <Resource
        name="reportes"
        list={Reporte.ReporteList}
        create={Reporte.ReporteCreate}
        show={ShowGuesser}
      />
    </div>
  );
};

export default ResourcePage;