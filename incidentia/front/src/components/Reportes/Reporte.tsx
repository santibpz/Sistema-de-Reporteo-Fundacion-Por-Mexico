import {
  Create,
  List,
  RecordContextProvider,
  useDataProvider,
  useDelete,
  useGetIdentity,
  useGetOne,
  useNotify,
  useRedirect,
} from "react-admin";
import Reportes from "./Reportes";
import ReporteForm from "./ReporteForm";
import {Grid, Paper, Typography, Divider, Card, IconButton, Chip} from "@mui/material";
import "@fontsource/roboto/300.css";
import ArticleSharpIcon from "@mui/icons-material/ArticleSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom";

import { useState } from "react";

import { Bars } from "react-loading-icons";

import img from "../../images/logo-fundacion-por-mexico.png";
import ComentarioForm from "../Comentarios/ComentarioForm";
import Comentarios from "../Comentarios/Comentarios";
import { ComentarioProps } from "../../types";

// componente que despliega la información de todos los reportes
const ReporteList = () => (
  <List>
    <Reportes />
  </List>
);

// componente para crear nuevos reportes
export const ReporteCreate = () => {
  const notify = useNotify()
  const onError = () => { 
     notify('Todos los campos deben llenarse', {type: 'error'});
};
  return (
    <Create mutationOptions={{onError}}>
      <ReporteForm />
    </Create>
  );
};

// componente para mostrar los reportes completos
export const ReporteShow = () => {
  const { data:identity } = useGetIdentity();
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const params = useParams();
  const [deleteOne] = useDelete()


  const [comentarios, setComentarios] = useState<ComentarioProps[]>([]);
  const [flag, setFlag] = useState(true)

  const { id } = params;

  // obtener la informacion del reporte en base a su id
  const { data, isLoading } = useGetOne(
    "reportes",
    { id },
    {
      onError: () => {
        notify("Hubo un error cargando la vista individual");
        redirect("/reportes");
      },
    }
  );

  // petición para obtener los comentarios de la base de datos
  flag ?  dataProvider
        .getComentarios("comentarios", { id })
        .then(({ data }) => {
            setComentarios(data)
            setFlag(false)
        })
        .catch(() => notify("Ocurrió un error al cargar los comentarios", {type: "error"})) : 
        null

  
  const refetchComentarios = () => setFlag(true)

  // funcion que maneja el evento de borrar un reporte
  const handleDelete = () => {
    // confirmamos si se quiere borrar el reporte
    confirm("¿Estás seguro que quieres borrar el reporte? \n Esta acción es irreversible.") ?
    deleteOne(
        'reportes',
        { id },
        {
            onSuccess: () => {
                notify('El reporte se ha borrado con éxito', { type: 'success' })
                redirect('/reportes')
                
            },
            onError: () => {
                notify('Ha ocurrido un error al intentar borrar el reporte. Intentar más tarde.', { type: 'error' })
            }
        }
    ) :
    null
  }
        
  console.log('aaa', data)
  if (isLoading) return <Bars />;

  return (
    <RecordContextProvider value={data}>
      {/* contenedor raiz de la vista del reporte */}
      <Grid container style={{ backgroundColor: "", padding: 1 }}>
        {/* contenedor en donde se mostrará el título, la fecha de creación y las opciones para editar, borrar y comentar */}
        <Grid item xs={12} style={{ backgroundColor: "", padding: 5 }}>
          <Paper style={{ height: "20vh" }} elevation={15}>
            <Grid container style={{ backgroundColor: "", height: "100%" }}>
              {/* Icono y titulo */}
              <Grid
                container
                xs={4}
                style={{ backgroundColor: "", height: "100%" }}
              >
                <Grid
                  container
                  item
                  xs={3}
                  justifyContent="center"
                  alignItems="center"
                >
                  <ArticleSharpIcon sx={{ fontSize: 70 }} />
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  item
                  xs={9}
                  style={{ backgroundColor: "", padding: 5 }}
                >
                  <Typography variant="h4">{data.titulo}</Typography>
                  <Typography variant="subtitle2">
                    Creado por {data.coordinador}
                  </Typography>
                </Grid>
              </Grid>

              {/* Grid en donde se visualiza la categoria, subcategoria, estatus y prioridad del reporte */}
              <Grid
                container
                xs={4}
                style={{ backgroundColor: "", height: "100%" }}
              >
                <Grid
                  container
                  item
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  xs={6}
                >
                  <Typography variant="subtitle2">Categoria</Typography>
                  <Typography variant="body1">{data.categoria}</Typography>
                  <Typography variant="subtitle2">Subcategoria</Typography>
                  <Typography variant="body1">{data.subcategoria}</Typography>
                </Grid>
                <Grid
                  container
                  item
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  xs={6}
                >
                  <Typography variant="subtitle2">Prioridad</Typography>
                  <Typography variant="body1">{data.prioridad}</Typography>
                  <Typography variant="subtitle2">Estatus</Typography>
                  <Typography variant="body1">{data.estatus}</Typography>
                </Grid>
              </Grid>

              {/* Grid en donde se visualizan los botones para editar, borrar y la fecha de creacion del reporte */}
              <Grid
                container
                direction="column"
                xs={4}
                style={{ backgroundColor: "", height: "100%" }}
              >
                <Grid
                  container
                  item
                  xs={6}
                  justifyContent="flex-end"
                  style={{ padding: 10 }}
                >
                  <Typography>Creado el {new Intl.DateTimeFormat('es-MX').format(new Date(data.fecha))}</Typography>
                </Grid>
                <Grid
                  container
                  item
                  justifyContent="flex-end"
                  alignItems="flex-end"
                  xs={6}
                >
                 
                  {identity.fullName === data.coordinador ? (
                  <IconButton onClick={handleDelete} color="primary">
                    <DeleteIcon sx = {{color:'red'}} />
                  </IconButton>):null}

                  <Chip sx ={{m:1}} label ={`Número de Oficio: ${data.oficio ?? 'Inexistente'}`} />
                
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* contenedor en donde se mostrará la descripción del reporte */}
        <Grid
          container
          item
          direction="column"
          xs={8}
          style={{ backgroundColor: "", height: "70vh", padding: 5 }}
        >
          <Paper
            elevation={10}
            style={{ backgroundColor: "", height: "100%", width: "100%" }}
          >
            <Grid
              container
              direction="column"
              style={{ height: "100%", padding: 10 }}
            >
              {/* titulo de la sección */}
              <Grid
                container
                item
                direction="column"
                justifyContent="center"
                alignItems="center"
                xs={5}
                style={{ padding: 8 }}
              >
                <img src={img} />
                <Typography variant="h3">Descripción del Reporte</Typography>
              </Grid>

              {/* descripción */}
              <Grid
                container
                item
                direction="column"
               
                xs
                style={{ backgroundColor: "", height: "" }}
              >
                <Grid
                  container
                  item
                  xs={12}
                  style={{ backgroundColor: "", padding: 5 }}
                >
                  <Grid
                    container
                    item
                    justifyContent="center"
                    alignItems="center"
                    xs
                    style={{ backgroundColor: "#eee" }}
                  >
                    <Card style={{ width: "50%", height: "80%", padding: 8 }}>
                      <Typography variant="subtitle1">
                        {data.descripcion}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>                
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* contenedor en donde se mostrarán dos Grids con las imagenes adjuntas y los comentarios correspondientes del reporte  */}
        <Grid
          container
          item
          xs={4}
          style={{ backgroundColor: "" }}
        >

          {/* comentarios */}
          <Grid xs={12} style={{ backgroundColor: "", padding: 5, height:'100%' }}>
            <Paper
              elevation={10}
              style={{ backgroundColor: "", height: "100%", width: "100%" }}>
              <Grid container direction='column' justifyContent='center' alignItems='center'>
                <Grid container item xs ={10}>
              {comentarios.length != 0 ? (
                <Comentarios comentarios={comentarios} refetchComentarios={refetchComentarios} />
              ) : (
                <Card sx ={{p:2, margin:'auto'}}>
                  No Hay comentarios
                </Card>
              )}
              </Grid>
              

              <Grid
                  container
                  item
                  justifyContent="center"
                  xs={2}
                  style={{ backgroundColor: "", padding: 7 }}
                >
                  <ComentarioForm reporteId={data.id} refetchComentarios = {refetchComentarios} />
                </Grid>
                </Grid>
            </Paper>
          </Grid>

          {/* imagenes
          <Grid xs={12} style={{ backgroundColor: "pink", padding: 5, height:'50%' }}>
            <Paper
                elevation={10}
                style={{ backgroundColor: "", height: "100%", width: "100%" }}>
                
              </Paper>
          </Grid> */}
        </Grid>
      </Grid>
    </RecordContextProvider>
  );
};

export default {
  ReporteList,
  ReporteCreate,
};
