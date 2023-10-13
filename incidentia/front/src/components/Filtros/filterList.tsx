import { SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import MailIcon from '@mui/icons-material/MailOutline';
import CategoryIcon from '@mui/icons-material/LocalOffer';
import ReporteFilter from './ReporteFilter'; // Your custom filter component

const MyFilterSidebar = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
    <CardContent>
      <ReporteFilter />

      {/* Example filter lists for your "Categoría" and "Prioridad" filters */}
      <FilterList label="Categoría" icon={<CategoryIcon />}>
        <FilterListItem label="Trabajadores de Aula" value={{ categoria: "Trabajadores de Aula" }} />
        <FilterListItem label="Inmobiliario" value={{ categoria: "Inmobiliario" }} />
        {/* Add more FilterListItem for other categories */}
      </FilterList>

      <FilterList label="Prioridad" icon={<MailIcon />}>
        <FilterListItem label="Alta" value={{ prioridad: "alta" }} />
        <FilterListItem label="Media" value={{ prioridad: "media" }} />
        <FilterListItem label="Baja" value={{ prioridad: "baja" }} />
      </FilterList>
    </CardContent>
  </Card>
);

export default MyFilterSidebar;