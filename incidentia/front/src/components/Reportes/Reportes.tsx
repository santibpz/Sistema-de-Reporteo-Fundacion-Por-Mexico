import React from "react"
import { useListContext, useNotify, useRefresh, useUpdate } from "react-admin"
import { ReporteProps } from "../../types"
import { Grid, Paper, Typography, Button, Box, Modal} from "@mui/material"
import { useState } from "react"

import {Radio, RadioGroup, FormControlLabel, FormControl, FormLabel} from '@mui/material';

const Reportes = () => {
    // obtener los datos de la lista de reportes
    const {data, isLoading} = useListContext()
    if (isLoading) return null
    return(
        // regresar todos los reportes que se representan como un componente ReporteCard
        <div>
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
        </div>
    )

}


// declaracion del componente que representa un reporte
const ReporteCard = (props:ReporteProps) => {
   
   
    return (
        <Paper
            sx={{
            p: 2,
            margin: '15px',
            // maxWidth: 350,
            width: 400,
            height: 300,
            flexGrow: 1,
            backgroundColor: '#E6E6FA',
            }}
            elevation={10}
            
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={1}>
                        <Grid item xs>
                            <Typography gutterBottom variant="h6" component="div" display='block'>
                                Título: {props.titulo}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Descripción: {props.descripcion}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Categoria: {props.categoria}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Subcategoria: {props.subcategoria}
                            </Typography>
                        </Grid>
                    {/* <Grid item>
                    </Grid> */}
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" component="div">
                            {props.fecha}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                            {(props.prioridad == "alta") ? (<p style={{color: 'red'}}>Prioridad {props.prioridad}</p>) : 
                            (props.prioridad == "media") ? (<p style={{color: 'orange'}}>Prioridad {props.prioridad}</p>) : 
                            (<p style={{color: 'green'}}>Prioridad {props.prioridad}</p>)}

                        </Typography>
                        <Typography sx={{ cursor: 'pointer' }} variant="subtitle2">
                        Estado: {props.estatus}
                        </Typography>
                        <ModalWindow id ={props.id}  titulo = {props.titulo} estatus={props.estatus} />
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
        );
   
}

interface ModalProps {
  titulo:string,
  estatus:string,
  id:string
}

const ModalWindow = ({titulo, estatus, id}:ModalProps) => {
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
                notify("Ha ocurrido un error al actualizar el estatus del Reporte. Intente más tarde.", { type: 'error' });
            }
          })
      }
      else {
        notify("El reporte ha mantenido su estatus")
      }

      setOpen(false)
    } 
    
  return (
    <div>
      <Button 
       onClick={handleOpen}
       variant="contained" 
       color="primary" 
       sx={{ mt: 2, ml: 1 }}>
        Actualizar Estatus
      </Button>

      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            {titulo}
          </Typography>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Selecciona la prioridad
          </Typography> */}
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
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
