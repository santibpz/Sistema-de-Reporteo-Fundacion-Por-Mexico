import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { NotFound, Title, usePermissions } from 'react-admin';

const Dashboard = () => {
    const {permissions} = usePermissions()
    const dashboardStyle = {
        bgcolor: "#F1F5F4",
        border: 'none',
        borderRadius: '2px',
        boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
        width: '92vw',
        height: '180vh'
    }
    return(
    <>
    { (permissions === 'Ejecutivo') ? (
        <Card sx ={{margin:'auto'}}>
        <Title title="Reporte Semanal" />
        <CardContent>
            <iframe style={dashboardStyle} src="https://charts.mongodb.com/charts-project-0-qgmep/embed/dashboards?id=652f37fa-76f7-42b9-871e-5b9959837d21&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=true&scalingWidth=scale&scalingHeight=scale">

            </iframe>
        </CardContent>
    </Card>
    ): (<NotFound />)}
    
    </>
    )
}

export default Dashboard