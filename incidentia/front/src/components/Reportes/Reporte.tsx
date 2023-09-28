import { Create, List, RecordContextProvider, SimpleShowLayout, TextField, useGetOne } from 'react-admin';
import Reportes from './Reportes';
import ReporteForm from '../ReporteForm';
import { Button, Grid, Paper, Typography, Divider, Card } from '@mui/material';
import '@fontsource/roboto/300.css';
import ArticleSharpIcon from '@mui/icons-material/ArticleSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PollIcon from '@mui/icons-material/Poll';
import { useParams } from 'react-router-dom'

import {useEffect, useState} from 'react'

import img from "../../images/logo-fundacion-por-mexico.png"

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
    const { data, isLoading } = useGetOne('reportes', { id:params.id }, {
        onSuccess: (response) => setRecord(response)
    });

    
    if (isLoading) return <span>Loading</span>
    return (
        <RecordContextProvider value={record}>

            {/* contenedor raiz de la vista del reporte */}
            <Grid container style={{backgroundColor:'', padding: 1}}>
                
                {/* contenedor en donde se mostrará el título, la fecha de creación y las opciones para editar, borrar y comentar */}
                <Grid item xs={12} style={{backgroundColor:'', padding:5}}>
                    <Paper style={{height: '20vh'}} elevation={15}>
                        
                        <Grid container  style={{backgroundColor:'', height:'100%'}}>
                            {/* Icono y titulo */}
                            <Grid container xs={4} style={{backgroundColor:'', height:'100%'}} >
                                <Grid container item xs ={3} justifyContent='center' alignItems='center'>
                                    <ArticleSharpIcon sx={{ fontSize:70}} />
                                </Grid> 
                                <Grid container direction='column' justifyContent='center' item xs={9} style={{backgroundColor:'', padding:5}} >
                                    <Typography variant="h4">
                                        {data.titulo}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Creado por usuario
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* Grid en donde se visualiza la categoria, subcategoria, estatus y prioridad del reporte */}
                            <Grid container xs={4} style={{backgroundColor:'', height:'100%'}}>
                                <Grid container item direction='column' justifyContent='center' alignItems='center' xs={6} >
                                    <Typography variant='subtitle2'>Categoria</Typography>
                                    <Typography variant='body1'>{data.categoria}</Typography>
                                    <Typography variant='subtitle2'>Subcategoria</Typography>
                                    <Typography variant='body1'>{data.subcategoria}</Typography>
                                </Grid>
                                <Grid container item direction='column' justifyContent='center' alignItems='center' xs={6} >
                                    <Typography variant='subtitle2'>Prioridad</Typography>
                                    <Typography variant='body1'>{data.prioridad}</Typography>
                                    <Typography variant='subtitle2'>Estatus</Typography>
                                    <Typography variant='body1'>{data.estatus}</Typography>
                                </Grid>
                            </Grid>

                            {/* Grid en donde se visualizan los botones para editar, borrar y la fecha de creacion del reporte */}
                            <Grid container direction ='column' xs={4} style={{backgroundColor:'', height:'100%'}}>
                                <Grid container item xs = {6} justifyContent='flex-end' style={{padding:10}} >
                                    <Typography>
                                        Creado el {data.fecha}
                                    </Typography>
                                </Grid >
                                <Grid container item justifyContent='flex-end' alignItems='flex-end' xs = {6}>
                                    <Button>
                                        <DeleteIcon sx={{color:'red', fontSize:35}}  />
                                    </Button>
                                    <Button>
                                        <EditIcon sx={{color:'green', fontSize:35, }} />
                                    </Button>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Paper>
                </Grid>

                {/* contenedor en donde se mostrará la descripción del reporte */}
                <Grid container item direction = 'column' xs={8} style={{backgroundColor:'', height:'70vh', padding:5}}>
                   <Paper elevation={10} style={{backgroundColor:'', height:'100%', width:'100%'}}>
                     <Grid container direction = 'column' style={{height:'100%', padding:10}}>
                        {/* titulo de la sección */}
                        <Grid container item direction='column' justifyContent='center' alignItems='center' xs = {5} style={{padding:8}}>
                            <img src={img}  />
                            <Typography variant="h3">Descripción del Reporte</Typography>
                        </Grid>

                        <Divider light/>
                        {/* descripción */}
                        <Grid container item direction='column' xs style={{backgroundColor:'', height:''}}>
                            <Grid container item xs ={9} style = {{backgroundColor:'', padding:5}}>
                                
                                <Grid container item justifyContent='center' alignItems='center' xs style = {{backgroundColor:'#002D62'}}>
                                   <Card style = {{width:'50%', height:'80%', padding: 8}}>
                                        <Typography variant='subtitle1'>
                                            {data.descripcion}
                                        </Typography>
                                   </Card>  
                                </Grid>
                            </Grid>

                            {/* botón para agregar seguimiento/comentario al reporte */}
                            <Grid container item justifyContent='center' xs = {3} style = {{backgroundColor:'', padding: 8}}>
                                <Button onClick={addFollowUp} variant = 'contained' sx={{backgroundColor:'#002D62'}}>Agregar Seguimiento</Button>
                            </Grid>
                        </Grid>
                      </Grid>
                    </Paper> 
                </Grid>

                {/* contenedor en donde se mostrarán dos Grids con las imagenes adjuntas y los comentarios correspondientes del reporte  */}
                <Grid container item xs={4} style={{backgroundColor:'grey', padding:2}}>
                    <Grid xs={12} style={{backgroundColor:'orange', padding:1}}>comments</Grid>
                    <Grid xs={12} style={{backgroundColor:'pink', padding:1}}>imagenes</Grid>
                </Grid>
                
            </Grid>
          
        </RecordContextProvider>
    )
}

export default {
    ReporteList,
    ReporteCreate
}