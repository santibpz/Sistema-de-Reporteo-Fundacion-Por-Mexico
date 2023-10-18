import React, { useState } from 'react';
import { useListContext } from "react-admin";
import { ReporteProps } from "../../types"
import { Grid, FormControl, InputLabel, Select, MenuItem, Chip, Paper, Typography, Divider, Box, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import Bars from 'react-loading-icons/dist/esm/components/bars';
import FolderIcon from '@mui/icons-material/Folder';
import { StyledBackgroundGrid } from "../../theme/themes"
import { StyledGrid } from "../../theme/themes"
import TextField from '@mui/material/TextField';
import { useDisableColors } from '../../theme/DisableColorContext'; 

const categorias = [
  { value: "65012c3d07eb217c902f7ba4", label: "Recursos humanos" },
  { value: "65012c3d07eb217c902f7ba1", label: "Mobiliario" },
  { value: "65012c3d07eb217c902f7ba2", label: "Equipo Tecnológico" },
  { value: "65012c3d07eb217c902f7ba0", label: "Infraestructura" },
  { value: "65012c3d07eb217c902f7ba6", label: "Materiales" },
  { value: "65012c3d07eb217c902f7ba5", label: "Beneficiarios"},
  { value: "65012c3d07eb217c902f7ba7", label: "Seguridad" },
  { value: "652fd5a3d4a5b32ad20f8fd0", label: "Fenómeno meteorológico" }
];

const prioridades = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" }
];

const ReportesArchivados = () => {
    // obtener los datos de la lista de reportes archivados
    const {data,
      isLoading,
      setFilters,
    } = useListContext();

  const [searchTerm, setSearchTerm] = useState(""); //Se inicializa la variable que actualiza el valor del input de búsqueda, se declara vacía para que al inicio no se muestre ningún reporte
  const [searchType, setSearchType] = useState("titulo");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const { disableColors } = useDisableColors();

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    setSearchTerm(""); // Limpia el término de búsqueda al cambiar el tipo de búsqueda
    setFilters({},[]);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setFilters({ titulo: event.target.value }, []);
    if(event.target.value === "") {
      setFilters({},[]);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setFilters({ categoria: event.target.value }, []);
    if(event.target.value === "") {
      setFilters({},[]);
    }
  };

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
    setFilters({ prioridad: event.target.value }, []);
    if(event.target.value === "") {
      setFilters({},[]);
    }
  };

    if(isLoading) return <Bars/>

    let searchInput = null;

    if (searchType === "titulo") {
      searchInput = (
        <TextField
          label={`Buscar por ${searchType}`}
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchTermChange}
          style={{ height: 56, marginTop:2}}
        />
      );
    } else if (searchType === "categoria") {
      searchInput = (
        <Select
          label="Seleccionar Categoría"
          variant="outlined"
          fullWidth
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ height: 54, marginTop: 2}}
        >
          <MenuItem value="">
            <em>Seleccionar Categoría</em>
          </MenuItem>
          {categorias.map((categoria) => (
            <MenuItem key={categoria.value} value={categoria.value}>
              {categoria.label}
            </MenuItem>
          ))}
        </Select>
      );
    } else if (searchType === "prioridad") {
      searchInput = (
        <Select
          label="Seleccionar Prioridad"
          variant="outlined"
          fullWidth
          value={selectedPriority}
          onChange={handlePriorityChange}
          style={{ height: 54, marginTop:2}}
        >
          <MenuItem value="">
            <em>Seleccionar Prioridad</em>
          </MenuItem>
          {prioridades.map((prioridad) => (
            <MenuItem key={prioridad.value} value={prioridad.value}>
              {prioridad.label}
            </MenuItem>
          ))}
        </Select>
      );
    }

    return(
      <div>
        <Grid 
        container 
        spacing={1} 
        alignItems="center"
        >
        <Grid 
          item 
          style={{ width: 'auto', padding: 15}}
          >
          {/*se agrega el filtro de búsqueda*/}
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Tipo de Búsqueda</InputLabel>
            {/*Se agrega el menú de selección de tipo de búsqueda*/}
            <Select value={searchType} onChange={handleSearchTypeChange} style={{ width: 200, height: 55 }}>
              <MenuItem value="titulo">Nombre de Incidente</MenuItem>
              <MenuItem value="categoria">Categoría</MenuItem>
              <MenuItem value="prioridad">Prioridad</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/*Se agrega el input de búsqueda*/}
        <Grid item xs style={{ width: 'auto', padding: 15}}>
          {searchInput}
        </Grid>
      </Grid>
      <Grid 
         container 
         spacing={1} 
         columnSpacing={2}
         rowSpacing={2}
         style={{padding: 15}}
         alignItems="center"
         justifyContent="center"
         
         >
            {data.map(reporte => <ReporteArchivadoCard key={reporte.id} {...reporte} disableColors={disableColors}/>)}
      </Grid>
      </div>
    )
}


const ReporteArchivadoCard = (props:ReporteProps & { disableColors: boolean }) => {
    return(
        <Grid container item sm lg = 'auto' alignItems="center" justifyContent="center" >
            <Paper
            sx={{
            width: 400,
            height: 950,
            // backgroundColor: '#E6E6FA',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
              '&:hover': {
                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.45)',
              },
            }}
            elevation={10}
        >
              {/* container */}
              <Grid container item direction='column' justifyContent='center' alignItems='center'>

                {/* sección de titulo de reporte archivado */}
                <StyledGrid categoria={props.categoria} disableColors={props.disableColors} container item direction='row'>


                    {/* icono y titulo */}
                    <Grid container item xs={9} sx ={{bgcolor: '', p:3}}>
                        <Grid container item direction='row'>
                            <Grid container justifyContent='center' alignItems='center' item xs={2} sx = {{bgcolor: ''}}>
                                <FolderIcon sx={{fontSize:50, color:"white"}} />
                            </Grid>
                            
                            <Grid container alignItems='center' item xs={10} sx = {{bgcolor: '', pl:2}}>
                                <Typography variant='body1' sx={{fontWeight:600, color:"white"}}>{props.titulo}</Typography>
                                <Typography variant = 'body2' style={{color:'#E5E4E2'}}>Seguimiento por {props.coordinador}</Typography>
                            </Grid>
                        </Grid>
                        
                    </Grid>

                    {/* stamp de resolucion */}
                    <Grid container item justifyContent='center' alignItems='center' xs = {3} sx={{marginRight:0}}>
                        <CircularStamp text={props.resolucion || ""} bgcolor={props.resolucion === 'Resuelto' ? 'green':'red'} />
                    </Grid>
                </StyledGrid>

                <Divider />

                {/* sección de informacion del reporte archivado */}
                <StyledBackgroundGrid container item justifyContent='center' alignItems='center' direction='row' sx={{p:1, marginTop:1, width:365, textAlign:'center', justifyContent:'center', alignItems:'center'}}>
                    <ShowInfo label='Categoria' data={props.categoria} />
                    <ShowInfo label='Subcategoria' data={props.subcategoria} />
                    <ShowInfo label='Prioridad' data={props.prioridad} />
                    <ShowInfo label='Estatus' data={props.estatus} />
                </StyledBackgroundGrid>

                <Divider />

                {/* sección de descripcion del reporte */}
                <Grid container item direction='column' justifyContent='' alignItems='center' sx ={{padding: 2, bgcolor: ''}}>
                    <Typography variant= "body1" sx={{fontWeight:800}}>Descripción del Reporte</Typography>
                    <StyledBackgroundGrid sx ={{ height:'100px', width: '100%', mt:1, p:1.5}}>
                        <Typography variant= "body2">{props.descripcion}</Typography>
                    </StyledBackgroundGrid>
                </Grid>

               <Divider /> 
                {/* sección de resolución del reporte */}

                <Grid container item sx={{p:2}}>

                    <Grid container direction='column' justifyContent='center' alignItems='center' item sx={{bgcolor:'', p:2}}>
                        <Typography variant="subtitle1" sx={{fontWeight:800}}>Resolución del Reporte</Typography>
                        <Typography>{props.razon}</Typography>
                    </Grid>

                    <StyledBackgroundGrid container item direction='column' alignItems='center' justifyContent='space-between' sx ={{p:2}}>
                            <Typography variant="subtitle1" sx={{fontWeight:800}}>Tiempo de resolución del Reporte</Typography>
                            <Chip label={props.tiempoResolucion} sx={{bgcolor:'#FFDB58', fontWeight:500}} />
                    </StyledBackgroundGrid>

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
        <Grid container item xs={6} justifyContent='center' alignItems='center' direction='column' sx={{p:1}}>
            <Typography variant="subtitle1" sx={{fontWeight:800}}>{label}</Typography>
            <Typography variant="body2" sx={{color:''}}>{data}</Typography>
        </Grid>
    )
}




export default ReportesArchivados