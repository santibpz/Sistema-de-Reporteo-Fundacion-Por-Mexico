import { useListContext } from "react-admin";
import { ReporteProps } from "../../types"
import { Grid, Chip, Paper, Typography, Divider, Box, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import Bars from 'react-loading-icons/dist/esm/components/bars';
import FolderIcon from '@mui/icons-material/Folder';

const ReportesArchivados = () => {
    // obtener los datos de la lista de reportes archivados
    const { data, isLoading } = useListContext();

    if(isLoading) return <Bars/>

    return(
      <Grid 
         container 
         spacing={1} 
         columnSpacing={2}
         rowSpacing={2}
         style={{padding: 15}}
         >
            {data.map(reporte => <ReporteArchivadoCard key={reporte.id} {...reporte} />)}
      </Grid>
    )
}


const ReporteArchivadoCard = (props:ReporteProps) => {
    return(
        <Grid container item sm lg = 'auto' alignItems="center" justifyContent="center" >
            <Paper
            sx={{
            width: 380,
            // backgroundColor: '#E6E6FA',
            }}
            elevation={10}
        >
              {/* container */}
              <Grid container direction='column' sx={{p:1}}>

                {/* secion de titulo de reporte archivado */}
                <Grid container item direction='row'>

                    {/* icono y titulo */}
                    <Grid container item xs={9} sx ={{bgcolor: '', p:2}}>
                        <Grid container item direction='row'>
                            <Grid container justifyContent='center' alignItems='center' item xs={2} sx = {{bgcolor: ''}}>
                                <FolderIcon sx={{fontSize:50}} />
                            </Grid>
                            
                            <Grid container alignItems='center' item xs={10} sx = {{bgcolor: '', pl:2}}>
                                <Typography variant='body1' sx={{fontWeight:600}}>{props.titulo}</Typography>
                                <Typography variant = 'body2' sx={{color:'darkGrey'}}>Seguimiento por {props.coordinador}</Typography>
                            </Grid>
                        </Grid>
                        
                    </Grid>

                    {/* stamp de resolucion */}
                    <Grid container item justifyContent='center' alignItems='center' xs = {3}>
                        <CircularStamp text={props.resolucion || ""} bgcolor={props.resolucion === 'Resuelto' ? 'green':'red'} />
                    </Grid>
                </Grid>

                <Divider />

                {/* sección de informacion del reporte archivado */}
                <Grid container item direction='row' sx={{p:2}}>
                   
                    <ShowInfo label='Categoria' data={props.categoria} />
                    <ShowInfo label='Subcategoria' data={props.subcategoria} />
                    <ShowInfo label='Prioridad' data={props.prioridad} />
                    <ShowInfo label='Estatus' data={props.estatus} />

                </Grid>

                <Divider />

                {/* sección de descripcion del reporte */}
                <Grid container item direction='column' justifyContent='' alignItems='center' sx ={{padding: 2, bgcolor: ''}}>
                    <Typography variant= "body1" sx={{fontWeight:800}}>Descripción del Reporte</Typography>
                    <Box sx ={{bgcolor: '#eee', height:'100px', width: '100%', mt:1, p:1.5}}>
                        <Typography variant= "body2">{props.descripcion}</Typography>
                    </Box>
                </Grid>

               <Divider /> 
                {/* sección de resolución del reporte */}

                <Grid container item sx={{p:2}}>

                    <Grid container justifyContent='center' item sx={{bgcolor:'', p:2}}>
                        <Typography variant="subtitle1" sx={{fontWeight:800}}>Resolución del Reporte</Typography>
                        <Typography>{props.razon}</Typography>
                    </Grid>

                    <Grid container item direction='column' alignItems='center' justifyContent='space-between' sx ={{bgcolor:'#eee', p:2}}>
                            <Typography variant="subtitle1" sx={{fontWeight:800}}>Tiempo de resolución del Reporte</Typography>
                            <Chip label={props.tiempoResolucion} sx={{bgcolor:'#FFDB58', fontWeight:500}} />
                    </Grid>

                </Grid>

                <Divider />
                {/* Sección de Intermediarios */}
                <Grid container item justifyContent='' alignItems='' direction='column' sx={{p:2}}>
                    <Typography variant="subtitle1" sx={{fontWeight:800, margin:'auto'}}>Intermediarios</Typography>

                        {(props.intermediarios != undefined && props.intermediarios.length > 0) ? 
                        (<IntermediariosTable data={props.intermediarios} />) :
                        (<Chip label='No se encontraron Intermediarios' sx={{bgcolor:'lightblue', fontSize:14, fontWeight:500, p:3, mt:1, ml:'auto', mr:'auto'}} />)}
                </Grid>

              </Grid>

            </Paper>
        </Grid>
    )
}

// componente para marcar la resolución del reporte
const CircularStamp = (props:{bgcolor:string, text:string}) => {
    const stampStyle = {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
      backgroundColor: `${props.bgcolor}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      color:'white',
    };
  
    return (
      <Box sx={stampStyle}>
        <span style={{margin:'auto', textAlign:'center'}}>{props.text}</span>
      </Box>
    );
  };


// componente para mostrar la información de los intermediarios en forma de tabla
const IntermediariosTable = (props:{data:Array<any>}) => {
  return (
    <Paper sx={{mt:2}}>
      <Table>
        <TableHead sx ={{bgcolor:'navy'}}>
          <TableRow >
            <TableCell sx ={{color:'white'}}>Nombre Intermediario</TableCell>
            <TableCell sx ={{color:'white'}}>Rol</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map(({nombreIntermediario, rol}, index) => (
            <TableRow key={index}>
              <TableCell>{nombreIntermediario}</TableCell>
              <TableCell>{rol}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

// compontente para mostrar información que se repite
const ShowInfo = ({label,data}:{label:string, data:string}) => {
    return(
        <Grid container item xs={6} justifyContent='center' alignItems='center' direction='column' sx={{bgcolor: '#eee', p:1}}>
            <Typography variant="subtitle1" sx={{fontWeight:800}}>{label}</Typography>
            <Typography variant="body2" sx={{color:''}}>{data}</Typography>
        </Grid>
    )
}




export default ReportesArchivados