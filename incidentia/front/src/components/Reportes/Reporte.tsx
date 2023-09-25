import { Create, List, RecordContextProvider, SimpleShowLayout, TextField, useGetOne } from 'react-admin';
import Reportes from './Reportes';
import ReporteForm from '../ReporteForm';
import { Button, Grid, Paper, Typography } from '@mui/material';
import '@fontsource/roboto/300.css';
import ArticleSharpIcon from '@mui/icons-material/ArticleSharp';
import { useParams } from 'react-router-dom'

import {useState} from 'react'

// componente que despliega la información de todos los reportes
const ReporteList = () => (
    <List>
       <Reportes /> 
    </List>
)

// componente para crear nuevos reportes
const ReporteCreate = () => {
    return(
        <Create>
            <ReporteForm />
        </Create>
    )
}
     
// componente para mostrar los reportes completos reportes
export const ReporteShow = () => {
    const [record, setRecord] = useState<Object>()
    const params = useParams()

    console.log("this is params, ", params)
    
    const { data, isLoading } = useGetOne('reportes', { id:params.id }, {
        onSuccess: (response) => setRecord(response)
    });
    console.log('daaaaaaaataaaaaa', data)
    if (isLoading) return <span>Loading</span>
    return (
        <RecordContextProvider value={data}>
            {/* contenedor raiz de la vista del reporte */}
            <Grid container style={{backgroundColor:'red', padding: 1}}>
                
                {/* contenedor en donde se mostrará el título, la fecha de creación y las opciones para editar, borrar y comentar */}
                <Grid item xs={12} style={{backgroundColor:'yellow', padding:1}}>
                    <Paper elevation={10}>
                        <Grid container xs={4} style={{backgroundColor:'lightSalmon'}} >
                            <Grid container item xs ={3} justifyContent='center'>
                                <ArticleSharpIcon sx={{fontSize:70}} />
                            </Grid> 
                            <Grid container item xs={9} style={{backgroundColor:'red', padding:5}} >
                                <Typography variant="h4">
                                    {data.titulo}
                                </Typography>
                                <Typography variant="subtitle2">
                                    Creado por usuario
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid></Grid>
                        <Grid></Grid>
                    </Paper>
                </Grid>

                {/* contener en donde se mostrará la descripción del reporte */}
                <Grid item xs={8} style={{backgroundColor:'lightblue'}}>descripcion</Grid>

                {/* contenedor en donde se mostrarán dos Grids con las imagenes adjuntas y los comentarios correspondientes del reporte  */}
                <Grid container item xs={4} style={{backgroundColor:'grey', padding:2}}>
                    <Grid xs={12} style={{backgroundColor:'orange', padding:1}}>comments</Grid>
                    <Grid xs={12} style={{backgroundColor:'pink', padding:1}}>imagenes</Grid>
                </Grid>
                
            </Grid>
            {/* <SimpleShowLayout>   
                <TextField source="titulo" />
                <TextField source="descripcion" />
            </SimpleShowLayout> */}
        </RecordContextProvider>
    )
}

export default {
    ReporteList,
    ReporteCreate
}