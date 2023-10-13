import React from 'react';
import { Filter, SelectInput, TextInput } from 'react-admin';
import { Card, CardContent, Typography } from '@mui/material';

const ReporteFilter = (props) => (
  <Filter {...props}>
    <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
      <CardContent>
        <TextInput label="Buscar por título" source="titulo" alwaysOn />

        <div>
          <Typography variant="h6" color="textSecondary">
            Categoría
          </Typography>
          <SelectInput
            label="Categoría"
            source="categoria"
            choices={[
              { id: "Trabajadores de Aula", name: "Trabajadores de Aula" },
              { id: "Inmobiliario", name: "Inmobiliario" },
              { id: "Equipo Tecnológico", name: "Equipo Tecnológico" },
              { id: "Infraestructura", name: "Infraestructura" },
              { id: "Material Académico", name: "Material Académico" },
              { id: "Beneficiarios", name: "Beneficiarios" },
              { id: "Otros", name: "Otros" },
            ]}
          />
        </div>

        <div>
          <Typography variant="h6" color="textSecondary">
            Prioridad
          </Typography>
          <SelectInput
            label="Prioridad"
            source="prioridad"
            choices={[
              { id: "alta", name: "Alta" },
              { id: "media", name: "Media" },
              { id: "baja", name: "Baja" },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  </Filter>
);

export default ReporteFilter;