import { Typography, Box, Grid, Button } from "@mui/material";
import { Empty, Link } from "react-admin"

const EmptyView = () => {
    return(
        <Grid container direction='column' justifyContent='center' alignItems='center'>
        <Empty />
        <Grid container item direction='column' justifyContent='center' alignItems='center'>
            {/* <Typography variant="h4" sx ={{color: '#909090', fontWeight:400}}>No hay Reportes Pendientes... </Typography> */}
            <Button component={Link} to = {"/aulas"} variant="contained" sx ={{margin:'auto', m:1, width:200}} > Ir a Aulas </Button>
        </Grid>  
        </Grid>
    )
}

export default EmptyView;