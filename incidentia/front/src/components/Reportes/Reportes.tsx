import React from "react"
import { Link, useCreate, useCreatePath, useListContext, useNotify, useRefresh, useUpdate } from "react-admin"
import { ModalProps, ReporteProps } from "../../types"
import { Grid, Paper, Typography, Button, Box, Modal} from "@mui/material"
import { useState } from "react"

import AssignmentIcon from '@mui/icons-material/Assignment';

import {Radio, RadioGroup, FormControlLabel, FormControl, FormLabel} from '@mui/material';

import { ReporteShow } from "./Reporte"

const Reportes = () => {
    // obtener los datos de la lista de reportes
    const {data, isLoading} = useListContext()
    if (isLoading) return null
    return(
        // regresar todos los reportes que se representan como un componente ReporteCard
        <Grid 
         container 
         spacing={1} 
         columnSpacing={2}
         rowSpacing={2}
         style={{padding: 15}}
         >
            {data.map(reporte => <ReporteCard 
                                  key = {reporte.id}
                                  id = {reporte.id}
                                  titulo = {reporte.titulo}
                                  descripcion = {reporte.descripcion}
                                  categoria={reporte.categoria}
                                  subcategoria={reporte.subcategoria}
                                  prioridad = {reporte.prioridad}
                                  estatus = {reporte.estatus}
                                  fecha = {reporte.fecha} />)}
        </Grid>
    )

}


// declaracion del componente que representa un reporte
export const ReporteCard = (props:ReporteProps) => {
   
    return (
      <Grid className="reporte" container item sm lg = 'auto' alignItems="center" justifyContent="center" >
        <Grid item>
        <Paper
            sx={{
            width: 300,
            height: 300,
            // backgroundColor: '#E6E6FA',
            }}
            elevation={10}
        >
            <Grid 
             style={{width: '100%', height: '100%', margin: 'auto'}}
             container 
             direction="column"
             justifyContent="center"
             alignItems="stretch"
            >
               {/* contenedor para el título y creador del usuario */}
               <Grid container item style = {{backgroundColor: '#F8F8F8'}} xs>
                  <Grid container justifyContent='center' alignContent='center' item xs={4}>
                    <AssignmentIcon fontSize="large"/>
                  </Grid>
                  <Grid sx={{p:1}} container direction='column' justifyContent='center' alignItems='flex-start' item xs={8} >
                    <Typography mt={1} variant="body2" ><strong>{props.titulo}</strong></Typography>
                    <Typography mb={1} variant="body2" style={{color:'darkgrey'}}>Creado por usuario</Typography>
                  </Grid>
               </Grid>  

               {/* contenedor para la categoria, subcategoria, estatus y prioridad */}
               <Grid style = {{ margin: '1px'}} xs={6} container item >
                   {/* container de categoria y subcategoria */}
                  <Grid container direction="column" justifyContent='center' alignItems='flex-start' item xs={7} style={{padding: 10}}>
                    <Typography variant="body2" style={{color:'darkgrey'}}>categoria</Typography>
                    <Typography variant="body1" >{props.categoria}</Typography>
                    <Typography mt = {1} variant="body2" style={{color:'darkgrey'}}>subcategoria</Typography>
                    <Typography variant="body1" >{props.subcategoria}</Typography>
                  </Grid>

                    {/* container de prioridad y estatus */}
                  <Grid container direction="column" justifyContent='space-around' alignItems='flex-start' style = {{ padding: 12}} item xs={5}>
                    <Typography variant="body2" >
                     { (props.prioridad == "alta") ? 
                       (<p style={{color: 'red'}}>Prioridad {props.prioridad}</p>) : 
                       (props.prioridad == "media") ? (<p style={{color: 'orange'}}>Prioridad {props.prioridad}</p>) : 
                       (<p style={{color: 'green'}}>Prioridad {props.prioridad}</p>)}
                    </Typography>
                    
                    <Typography mb={1} variant="body2" style={{color:'darkgrey'}}>Estatus {props.estatus}</Typography>

                    <hr
                    style={{
                      backgroundColor: 'grey',
                      height: '5px',
                      width: '100%'
                    }}
                  />
                  </Grid>
               </Grid>          
    
               <Grid container justifyContent="center" alignItems="center" style = {{ backgroundColor: '#003366'}} xs item >
                <ModalWindow id ={props.id} titulo = {props.titulo} estatus={props.estatus} />
                <Link to={`/reportes/show/${props.id}`}>Ver Reporte</Link>
               </Grid>
                
            </Grid>
        </Paper>
        </Grid>
      </Grid> 
        );
   
}


export const ModalWindow = ({titulo, estatus, id}:ModalProps) => {
  const [update, { isLoading, error }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(estatus)
  const handleOpen = () => setOpen(true);
  const handleClose = () => { 
    setOpen(false)
    setValue(estatus)
  }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue((event.target as HTMLInputElement).value);
    };

    const handleClick = () => {
      if(value !== estatus) {
        update(
          'reportes',
          {
            id,
            data: { estatus: value }
          },
          {
            onSuccess: () => {
                refresh();
                notify("El reporte ha sido actualizado con éxito");
            },
            onError: (error) => {
                console.log(error)
                notify("Ha ocurrido un error al actualizar el estatus del Reporte. Intente más tarde.");
            }
          })
      }
      else {
        notify("El reporte ha mantenido su estatus")
      }

      setOpen(false)
    } 
  
  if(error) notify("Ha ocurrido un error, Intente más tarde.")
  return (
    <div>
      <Button 
       className = "actualizarBtn"
       size="small"
       onClick={handleOpen}
       disabled={isLoading}
       sx={{ padding: '7px', color: 'black',  backgroundColor: '#F0FFF0', '&:hover': {
        transform: 'scale(1.1)',
        backgroundColor: '#F0FFF0'
    }}}>
        Actualizar Estatus
      </Button>

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            {titulo}
          </Typography>

          <FormControl>
            <FormLabel id="controlled-radio-buttons-group">Selecciona el estatus</FormLabel>
            <RadioGroup
              aria-labelledby="controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel value="pendiente" control={<Radio />} label="pendiente" />
              <FormControlLabel value="completado" control={<Radio />} label="completado" />
            </RadioGroup>
          </FormControl>

          <Button 
          onClick={handleClick}
          variant="contained" 
          color="secondary" 
          >
            Guardar
          </Button>
          

          <Button 
          onClick={handleClose}
          variant="contained" 
          color="secondary" 
          >
            Cerrar
          </Button>

        </Box>
      </Modal>
    </div>
  );
}

export default Reportes


// <Grid item xs={12} sm container>
//                     <Grid item xs container direction="column" spacing={1}>
//                         <Grid item xs>
//                             <Typography gutterBottom variant="h6" component="div" display='block'>
//                                 Título: {props.titulo}
//                             </Typography>
//                             <Typography variant="body2" gutterBottom>
//                                 Descripción: {props.descripcion}
//                             </Typography>
//                             <Typography variant="body2" gutterBottom>
//                                 Categoria: {props.categoria}
//                             </Typography>
//                             <Typography variant="body2" gutterBottom>
//                                 Subcategoria: {props.subcategoria}
//                             </Typography>
//                         </Grid>
//                     {/* <Grid item>
//                     </Grid> */}
//                     </Grid>
//                     <Grid item>
//                         <Typography variant="subtitle2" component="div">
//                             {props.fecha}
//                         </Typography>

//                         <Typography variant="subtitle2" color="text.secondary">
//                             {(props.prioridad == "alta") ? (<p style={{color: 'red'}}>Prioridad {props.prioridad}</p>) : 
//                             (props.prioridad == "media") ? (<p style={{color: 'orange'}}>Prioridad {props.prioridad}</p>) : 
//                             (<p style={{color: 'green'}}>Prioridad {props.prioridad}</p>)}

//                         </Typography>

//                         <Typography sx={{ cursor: 'pointer' }} variant="subtitle2">
//                         Estado: {props.estatus}
//                         </Typography>

//                         <ModalWindow id ={props.id}  titulo = {props.titulo} estatus={props.estatus} />
//                     </Grid>
//                 </Grid>