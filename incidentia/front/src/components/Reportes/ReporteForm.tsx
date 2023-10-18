import { useState, useEffect } from "react";
import {
  RadioButtonGroupInput,
  SelectInput,
  SimpleForm,
  TextInput,
  useDataProvider,
  SaveButton,
  Toolbar,
  maxValue
} from "react-admin";
import { Categoria, Subcategoria } from "../../types";
import { Paper, Typography } from "@mui/material";
import { StyledTypography, StyledLogo } from "../../theme/themes";

const validateOficio = (value) => {
  if (!/^\d+$/.test(value)) {
    return "Oficio debe contener solo números";
  }
  return undefined; // Validation passed
};

const SaveToolbar = () => (
  <Toolbar style={{width:500, display: 'flex', justifyContent: 'center'}} >
      <SaveButton type="button" style={{width:160, color:"white", borderRadius:10}}/>
  </Toolbar>
);

const ReporteForm = () => {
  // definir el dataProvider
  const dataProvider = useDataProvider();

  // crear el estado para la categoria seleccionada
  const [categoriaId, setCategoriaId] = useState<string>("");

  // crear estados para las categorias y subcategorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);

  // obtener las categorias de la base de datos
  useEffect(() => {
    dataProvider
      .getList("categorias", {
        pagination: { page: 0, perPage: 0 },
        filter: {},
        sort: { field: "", order: "" },
      })
      .then(({ data }) => setCategorias(data))
      .catch((err) => console.log(err));
  }, [dataProvider]);

  // obtener las subcategorias de la base de datos dependiendo de la categoria seleccionada
  useEffect(() => {
    const fetchSubcategorias = async () => {
      categoriaId
        ? await fetch(`${import.meta.env.VITE_SIMPLE_REST_URL}/subcategorias/${categoriaId}`)
            .then((data) => data.json())
            .then((data) => setSubcategorias(data))
            .catch((err) => console.log(err))
        : ["Otro"];
    };
    fetchSubcategorias();
  }, [categoriaId]);

  // regresar el formulario
  return (
    <div style={{display: "flex", flexDirection: 'column', alignItems: 'center' }}>
    <StyledLogo style={{height: 100}}/>
    <StyledTypography><h1>Nuevo Reporte</h1></StyledTypography>
    <Paper style={{width: 500, display: "flex", justifyContent: "center", margin: "0 auto", marginBottom:50, borderRadius:10}}>
      
      <SimpleForm justifyContent="center" alignItems="center" style={{padding:10, marginTop:20}} toolbar= {<SaveToolbar/>}>
        
        <TextInput source="titulo" style={{width:300}} required />
        <TextInput source="descripcion" style={{width:300}} multiline required />
        <RadioButtonGroupInput
          style={{width:300, display: "flex", justifyContent: "center", margin: "0 auto"}}
          source="prioridad"
          choices={[
            { id: "alta", name: "Alta" },
            { id: "media", name: "Media" },
            { id: "baja", name: "Baja" },
          ]}
          required
        />
        <SelectInput
          style={{width:300}}
          onChange={(e) => setCategoriaId(e.target.value)}
          source="categoria"
          choices={categorias}
          optionText="nombre"
          optionValue="id"
          required
        />
        <SelectInput
          style={{width:300}}
          source="subcategoria"
          choices={subcategorias}
          optionText="nombre"
          optionValue="id"
          required
          disabled={!categoriaId}
        />
        <TextInput source="oficio" style={{width:300}} validate={validateOficio}/>
      </SimpleForm>
    </Paper>
    </div>
  );
};

export default ReporteForm;