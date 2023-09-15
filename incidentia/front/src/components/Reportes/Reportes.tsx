import { useListContext } from "react-admin"
import { ReporteProps } from "../../types"
import { Grid, Paper, Typography} from "@mui/material"

const Reportes = () => {
    // obtener los datos de la lista de reportes
    const {data, isLoading} = useListContext()
    if (isLoading) return null
    return(
        // regresar todos los reportes que se representan como un componente ReporteCard
        <div>
            {data.map(reporte => <ReporteCard 
                                  key = {reporte.id}
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
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
        );
   
}


export default Reportes
