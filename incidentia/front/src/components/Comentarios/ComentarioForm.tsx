import React, { useState } from 'react'
import { Grid, Typography, Button, Box, Modal, TextField, Divider, IconButton} from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';

import CloseIcon from '@mui/icons-material/Close';
import { useCreate, useNotify, useRefresh, useUpdate } from 'react-admin';

interface ComentarioFormProps {
    reporteId?: string,
    comentarioId?: string,
    edit?: boolean,
    comentarioData?: string,
    refetchComentarios: () => void
}

// componente para agregar un nuevo comentario o editar un comentario
const ComentarioForm = ({reporteId="", comentarioId="", edit=false, comentarioData="", refetchComentarios}:ComentarioFormProps) => {
    const notify = useNotify();
    const refresh = useRefresh();

    // react-admin hook para crear un nuevo comentario
    const [create, { isLoading }] = useCreate();

    // react-admin hook para crear un nuevo comentario
    const [update] = useUpdate();
  
    const [open, setOpen] = useState(false)
    const [markError, setMarkError] = useState(false)
    const [comentario, setComentario] = useState(comentarioData)    
    const handleOpen = () => setOpen(true)
    const handleClose = () => {
      setOpen(false)
      setComentario(comentario)
    } 
  
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 26   
      }

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComentario((event.target as HTMLInputElement).value);
        if(comentario.length >= 20) {
          setMarkError(false)
        }
      }        


      const handleCreate = () => {
        if(comentario.length < 20) {
          setMarkError(true)
          notify('El comentario debe de tener una longitud de al menos 20 caractéres', { type: 'error' })
          return;
        }

      const data = {
          comentario,
          reporteId
        }
        create('comentarios', { data },  {
            onSuccess: () => {
              refetchComentarios()
              notify("El comentario se ha creado con éxito", { type: 'success' })
            },
            onError : () => notify("Se ha producido un error, Intente más tarde", { type: 'success' })
            ,
            onSettled: () => {
              handleClose() // cerrar el modal de comentarios
              setComentario('')
            } 
        })
      }

      // función para manejar la edición de un comentario
      const handleEdit = () => {

        const id = comentarioId
        const data = { comentario }

        update(
          'comentarios',
          { id, data },
          {
            onSuccess: () => {
              refetchComentarios()
              refresh()
              notify("El comentario se ha editado con éxito.", {type: 'success'})
            } ,
            onError: () => notify("Ha ocurrido un error editando el comentario, intente más tarde.", {type: 'error'}),
            onSettled: () => handleClose()
          }
        )
      }
  
    // if(error) notify("Ha ocurrido un error, Intente más tarde.")
    return (
      <>
        {
          edit ? (
            <IconButton onClick={handleOpen} color="primary">
                <EditIcon sx = {{color:'green'}} />
            </IconButton>
          ) :
            <Button
            size="small"
            onClick={handleOpen}
            sx={{ padding: '7px', color: 'black',  backgroundColor: 'lightblue', '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: '#F0FFF0'
            }}}>
            Agregar Seguimiento
          </Button>
        }
        
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {/* contenedor del componente para agregar un comentario */}
            <Grid container direction='column' style = {{backgroundColor: '', width: '100%', height: '100%'}}>
                {/* titulo */}
                <Grid container item justifyContent='space-around' alignItems = 'center' xs style = {{backgroundColor:''}} >
                    <Typography variant = "h5" sx = {{color: ''}}>
                        {edit ? "Editar Comentario" : "Agregar Seguimiento" }
                    </Typography>
                    <Button onClick = {handleClose} sx = {{backgroundColor:''}}>
                        <CloseIcon />
                    </Button>
                </Grid>
                <Divider />
                <Grid container item direction = 'column' justifyContent='center' alignItems = 'center' xs={8} sx={{backgroundColor: ''}} >
                    <Typography variant = "body2" sx = {{mr: 22, color: 'grey'}}>
                        {edit ? "Edita el Comentario" : "Añade un comentario" }
                    </Typography>
                    <TextField
                        value = {comentario}
                        onChange = {handleChange}
                        sx = {{width: '80%'}}
                        id="outlined-multiline-flexible"
                        label="comentario"
                        variant="outlined"
                        multiline
                        rows={8}
                        error = {markError}
                        required
                        />
                    
                </Grid>
                <Grid container item justifyContent='center' alignItems = 'center' xs sx = {{backgroundColor:'#B0E0E6'}} >
                    <Button 
                     onClick = {edit ? handleEdit : handleCreate} // manejar el evento de guardar el comentario
                     sx = {{height: 20, p: 2, border: '1px solid grey', backgroundColor:'white', '&:hover': {
                     transform: 'scale(1.1)',
                     backgroundColor: '#F0FFF0'
                  }}}>
                        {edit ? "Guardar Cambios" : "Guardar Comentario" }
                    </Button>

                </Grid>
            </Grid>
          </Box>
        </Modal>
      </>
    );
  }

  export default ComentarioForm;