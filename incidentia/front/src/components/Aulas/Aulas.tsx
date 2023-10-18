import { useListContext, useRedirect } from "react-admin";
import { Grid, Chip, Paper, Typography, Divider, Button } from "@mui/material"
import Bars from 'react-loading-icons/dist/esm/components/bars';
import SchoolIcon from '@mui/icons-material/School';
import { StyledChip } from "../../theme/themes";

const Aulas = () => {
    // obtener los datos de la lista de las aulas
    const { data, isLoading } = useListContext();

    if(isLoading) return <Bars/>

    return(
      <Grid 
         container 
         spacing={1} 
         columnSpacing={2}
         rowSpacing={2}
         style={{padding: 15}}
         justifyContent="center"
         >
            {data.map(aula => <AulaCard key={aula.id} {...aula} />)}
      </Grid>
    )
}

interface AulaProps {
    id:string
    nombre:string
    direccion:string
    numReportesPendientes?: number
    numReportesArchivados?: number
}

const AulaCard = (props:AulaProps) => {
    const redirect = useRedirect()
    // const { data, total, isLoading, error, refetch } = useGetList();

    // const showReportes = () => {
    //     useGetList('reportes',
    //     {
    //         pagination: { 0, 9 },
    //         sort: { "id", "ASC" },
    //         {"aula": props.id}
            
    //     },
    //     options)
    // }
    return(
        <Grid container sm lg='auto' item alignItems='center' justifyContent='center' >
            <Paper
            sx={{
            width: 400,
            height: 235,
            }}
            elevation={10}
        >
              {/* container de la tarjeta de aula */}
              <Grid container direction='column' sx={{p:1, height:'100%', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
              '&:hover': {
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.45)',
              }, }}>

                {/* container de nombre y direccion de aula */}
                <Grid container item justifyContent='space-between' alignItems ='center' sx={{ p:0.5, height:'35%'}}>
                    <SchoolIcon sx ={{fontSize:50}} />
                    <Grid xs ={10} container item direction='column'>
                        <Typography variant="body1" sx ={{fontWeight:700}}>{props.nombre}</Typography>
                        <Typography variant="subtitle2" sx ={{color:'grey'}}>{props.direccion}</Typography>
                    </Grid>
                </Grid>

                <Divider />

                {/* Informacion de reportes pendientes y archivados */}
                <Grid container item direction='row' justifyContent='space-between' sx ={{ height:'40%', mb:0.3}}>
                    <Grid container item direction='column' justifyContent='space-between' xs ={6} sx ={{bgcolor:''}}>
                        <Chip sx ={{ bgcolor: '#AAA', width:170, margin:'auto', color:'white'}} label={`Reportes pendientes: ${props.numReportesPendientes ?? 0}`}/>
                        <Button onClick={() => redirect( `/reportes?filter={"aula":"${props.id}"}`)} sx ={{mt:0.1}}>Ver Reportes</Button>
                    </Grid>
                    <Grid container item direction='column' justifyContent='center' xs ={6}>
                        <StyledChip sx ={{ width:170, margin:'auto', color:'white'}} label={`Reportes Archivados: ${props.numReportesArchivados ?? 0}`}/>
                        <Button sx ={{mt:0.1}}>Ver Archivados</Button>
                    </Grid>
                </Grid>

                <Divider />

                {/* Boton para ver coordinadores nacionales del aula */}
                <Grid container item justifyContent='center' alignItems='center' sx={{p:1.2, height:'20%'}}>
                    <Button fullWidth variant='contained' style={{color:'white'}} >Ver Coordinadores de {props.nombre}</Button>
                </Grid>
              </Grid>

            </Paper>
        </Grid>
    )
}

export default Aulas