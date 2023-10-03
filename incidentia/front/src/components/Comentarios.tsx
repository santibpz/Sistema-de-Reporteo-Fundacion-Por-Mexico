import { ComentarioProps } from "../types"
import { Grid, Card, Typography, Avatar, Box, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import { useDelete, useNotify } from "react-admin";
import { Bars } from "react-loading-icons";
import ComentarioForm from "./ComentarioForm";

interface ComentariosType {
    comentarios: Array<ComentarioProps>,
    refetchComentarios: () => void
}

const Comentarios = ({ comentarios, refetchComentarios }: ComentariosType) => {
    // layout de los comentarios
    return(
        <Grid
          sx={{
            overflowY: "scroll",
            backgroundColor:'',
            height: "100%",
            width: "100%",
            maxHeight: '250px',
            paddingBottom: 2
          }}
          container
          direction='row'
          >
            {/* titulo */}
            <Grid container item xs sx = {{backgroundColor: '#F0F0F0', p: 1}}>
                <Typography variant = "subtitle2">
                    Comentarios {`(${comentarios.length})`}
                </Typography>
            </Grid>

            {/* contenedor de todos los comentarios */}
            <Grid container item justifyContent='center' alignItems='center' xs = {12} sx = {{backgroundColor: '', height:'90%', p: 1}}>
                {
                    // iteramos por todos los comentarios que se reciben como props y por cada uno desplegamos un componente que se encarga de darle estilo y mostrar la informacion
                    comentarios.map(({id, publicadoPor, comentario, fecha}) => (
                                                <ComentarioBox
                                                key = {id}
                                                id= {id}
                                                publicadoPor={publicadoPor}
                                                comentario= {comentario}
                                                fecha = {fecha}
                                                refetchComentarios = {refetchComentarios}
                                                />))
                }
            </Grid>
        </Grid>
    )
}


// componente que muestra la información de un comentario
const ComentarioBox = ({id, publicadoPor, comentario, fecha, refetchComentarios}:ComentarioProps) => {
    const notify = useNotify()
    const [deleteOne, { isLoading }] = useDelete()

    
    // funcion para borrar un comentario
    const deleteComment = () => {
        // confirmamos si se quiere borrar el comentario
        confirm("¿Estás seguro que quieres borrar el comentario? \n Esta acción es irreversible.") ?
            deleteOne(
                'comentarios',
                { id },
                {
                    onSuccess: () => {
                        refetchComentarios()
                        notify('El comentario se ha borrado con éxito', { type: 'success' })
                    },
                    onError: () => {
                        notify('Ha ocurrido un error al intentar borrar el comentario. Intentar más tarde.', { type: 'error' })
                    }
                }
            ) :
            null
    }

    if(isLoading) return <Bars /> // si está cargando se muestra un icono para ayudar al usuario a entender que es lo que está pasando
    return (

        // layout de comentariobox
        <Grid item style = {{backgroundColor:'', padding: 4, margin:'1px', height: '', width: '100%'}}>
            <Card sx = {{height: '200px', width: '100%', backgroundColor:'#101010', border: '1px solid #E8E8E8 '}}>
               <Grid container sx = {{height: '100%', width: '100%', backgroundColor:''}}>
                 {/* Icono y nombre de usuario */}
                 <Grid container item justifyContent='space-between' alignItems = 'center' xs={12} sx = {{ backgroundColor: '', height: '20%'}}>
                    <Grid container item justifyContent='flex-start' alignItems = 'center' xs ={9}>
                        <Avatar
                        alt="avatar"
                        sx={{ width: 24, height: 24, ml: 1.5}}
                        />
                        <Typography sx = {{color: 'white', ml:1}}>
                            {publicadoPor}
                        </Typography>
                    </Grid>
                 

                    {/* sección de botones */}
                    <Grid container item xs = {3} justifyContent='center' alignItems='center' sx = {{backgroundColor: ''}}>
                            <IconButton onClick={deleteComment} color="primary">
                                <DeleteIcon sx = {{color:'red'}} />
                            </IconButton>
                            {/* Edit Icon */}
                            <ComentarioForm 
                             edit={true} 
                             comentarioId={id}
                             comentarioData={comentario} 
                             refetchComentarios={refetchComentarios} />
                    </Grid>

                 </Grid>

                 {/* comentario */}
                 <Grid container item justifyContent='center' xs = {12} sx = {{ backgroundColor: '', height: '65%'}}>
                    <Box sx ={{backgroundColor: 'white', height: '100%', width: '95%', p:1, borderRadius: '5px'}}>
                        <Typography variant='body2'>
                            {comentario}
                        </Typography>
                    </Box>
                 </Grid>

                    {/* sección de fecha */}
                    <Grid container item alignItems = 'center' xs = {12} sx = {{ backgroundColor: '', height: '15%'}}>
                    <Typography variant = 'subtitle2' sx = {{ ml:2.5, fontSize: '11px', color: 'white'}}>
                        Creado el {fecha}
                    </Typography>
                
                 </Grid>
               </Grid>
            </Card>
        </Grid>
    )
}

export default Comentarios