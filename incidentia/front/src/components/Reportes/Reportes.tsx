import React, { useState } from "react"
import { Link, useCreate, useCreatePath, useListContext, useNotify, useRefresh, useUpdate } from "react-admin"
import { ModalProps, ReporteProps } from "../../types"
import { Grid, Select, InputLabel, MenuItem, Paper, Typography, Button, Box, Modal, FormGroup, Checkbox,} from "@mui/material"
import Divider from "@mui/material/Divider"
import AssignmentIcon from '@mui/icons-material/Assignment';
import {Radio, RadioGroup, FormControlLabel, FormControl, FormLabel} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { ReporteShow } from "./Reporte"
import TextField from '@mui/material/TextField';
import { on } from "events"
import { redirect } from "react-router-dom"
import ConfirmacionDialog from "../ConfirmacionDialog"

const categorias = [
  { value: "65012c3d07eb217c902f7ba4", label: "Trabajadores de Aula" },
  { value: "65012c3d07eb217c902f7ba1", label: "Inmobiliario" },
  { value: "65012c3d07eb217c902f7ba2", label: "Equipo Tecnológico" },
  { value: "65012c3d07eb217c902f7ba0", label: "Infraestructura" },
  { value: "65012c3d07eb217c902f7ba6", label: "Material Académico" },
  { value: "65012c3d07eb217c902f7ba5", label: "Beneficiarios"},
  { value: "65012c3d07eb217c902f7ba7", label: "Otros" }
];

const prioridades = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" }
];

const Reportes = () => {
    // obtener los datos de la lista de reportes
    const {data,
        isLoading,
        displayedFilters,
        filterValues,
        setFilters,
        hideFilter
      } = useListContext();

    const [searchTerm, setSearchTerm] = useState(""); //Se inicializa la variable que actualiza el valor del input de búsqueda, se declara vacía para que al inicio no se muestre ningún reporte
    const [searchType, setSearchType] = useState("titulo");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("");

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
    //setFilters({ titulo: 'charly' }, []);

    if (isLoading) return null

    let searchInput = null;

    if (searchType === "titulo") {
      searchInput = (
        <TextField
          label={`Buscar por ${searchType}`}
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchTermChange}
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
    // regresar todos los reportes que se representan como un componente ReporteCard
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
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Tipo de Búsqueda</InputLabel>
            <Select value={searchType} onChange={handleSearchTypeChange}>
              <MenuItem value="titulo">Nombre de Incidente</MenuItem>
              <MenuItem value="categoria">Categoría</MenuItem>
              <MenuItem value="prioridad">Prioridad</MenuItem>
            </Select>
          </FormControl>
        </Grid>
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
         >
            {data.map(reporte => <ReporteCard 
                                  key = {reporte.id}
                                  id = {reporte.id}
                                  coordinador = {reporte.coordinador}
                                  titulo = {reporte.titulo}
                                  descripcion = {reporte.descripcion}
                                  categoria={reporte.categoria}
                                  subcategoria={reporte.subcategoria}
                                  prioridad = {reporte.prioridad}
                                  estatus = {reporte.estatus}
                                  fecha = {reporte.fecha} />)}
      </Grid>
    </div>
    )
}


// declaracion del componente que representa un reporte
export const ReporteCard = (props:ReporteProps) => {
    return (
      <Grid className="reporte" container item sm lg = 'auto' alignItems="center" justifyContent="center" >
        <Grid item>
        <Paper
            sx={{
            width: 300,
            height: 300,
            // backgroundColor: '#E6E6FA',
            }}
            elevation={10}
        >
            <Grid 
             style={{width: '100%', height: '100%', margin: 'auto'}}
             container 
             direction="column"
             justifyContent="center"
             alignItems="stretch"
            >
               {/* contenedor para el título y creador del usuario */}
               <Grid container item style = {{backgroundColor: '#F8F8F8'}} xs>
                  <Grid container justifyContent='center' alignContent='center' item xs={4}>
                    <AssignmentIcon fontSize="large"/>
                  </Grid>
                  <Grid sx={{p:1}} container direction='column' justifyContent='center' alignItems='flex-start' item xs={8} >
                    <Typography mt={1} variant="body2" ><strong>{props.titulo}</strong></Typography>
                    <Typography mb={1} variant="body2" style={{color:'darkgrey'}}>Abierto por {props.coordinador}</Typography>
                  </Grid>
               </Grid>  

               {/* contenedor para la categoria, subcategoria, estatus y prioridad */}
               <Grid style = {{ margin: '1px'}} xs={6} container item >
                   {/* container de categoria y subcategoria */}
                  <Grid container direction="column" justifyContent='center' alignItems='flex-start' item xs={7} style={{padding: 10}}>
                    <Typography variant="body2" style={{color:'darkgrey'}}>categoria</Typography>
                    <Typography variant="body1" >{props.categoria}</Typography>
                    <Typography mt = {1} variant="body2" style={{color:'darkgrey'}}>subcategoria</Typography>
                    <Typography variant="body1" >{props.subcategoria}</Typography>
                  </Grid>

                    {/* container de prioridad y estatus */}
                  <Grid container direction="column" justifyContent='space-around' alignItems='flex-start' style = {{ padding: 12}} item xs={5}>
                    <Typography variant="body2" >
                     { (props.prioridad == "alta") ? 
                       (<p style={{color: 'red'}}>Prioridad {props.prioridad}</p>) : 
                       (props.prioridad == "media") ? (<p style={{color: 'orange'}}>Prioridad {props.prioridad}</p>) : 
                       (<p style={{color: 'green'}}>Prioridad {props.prioridad}</p>)}
                    </Typography>
                    
                    <Typography mb={1} variant="body2" style={{color:'darkgrey'}}>Estatus {props.estatus}</Typography>

                    <hr
                    style={{
                      backgroundColor: 'grey',
                      height: '5px',
                      width: '100%'
                    }}
                  />
                  </Grid>
               </Grid>          
    
               <Grid container justifyContent="center" alignItems="center" style = {{ backgroundColor: '#003366'}} xs item >
                <ModalWindow id ={props.id} titulo = {props.titulo} estatus={props.estatus} />
                <Link to={`/reportes/show/${props.id}`}>Ver Reporte</Link>
               </Grid>
                
            </Grid>
        </Paper>
        </Grid>
      </Grid> 
        );
   
}


// ########################## START HERE ##########################
// ########################## START HERE ##########################
// ########################## START HERE ##########################
// ########################## START HERE ##########################
// ########################## START HERE ##########################

export const ModalWindow = ({titulo, estatus, id}:ModalProps) => {
  const [create, { isLoading, error }] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
 
  const [flag, setFlag] = useState(false)

  const [markError, setMarkError] = useState(false)
  const [open, setOpen] = useState(false)
  const [estado, setEstado] = useState(estatus)
  const [resolucion, setResolucion] = useState(false)
  const [resolucionValue, setResolucionValue] = useState('')
  const [completado, setCompletado] = useState(false)
  const [razon, setRazon] = useState('')
  const handleOpen = () => setOpen(true);
  const handleClose = () => { 
    setOpen(false)
    setEstado(estatus)
    setCompletado(false)
    setResolucion(false)
    setResolucionValue('')
    setFlag(false)
  }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#1A1110 ',
        color: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p:2
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, action:string) => {
      const selection = (event.target as HTMLInputElement).value
      switch(action) {
        case 'isCompleted':
          setEstado(selection);
          if(selection=='completado') {
            setCompletado(true) 
          } else {
            setCompletado(false);
            setResolucionValue('')
            setResolucion(false)
            setFlag(false)
            setRazon('')
          }
            
          break;
        case 'isResolved':
          if(selection == "Resuelto") {
            setResolucion(true);
            setFlag(false)
            
          } else {
              setResolucion(false);
              setFlag(true)
          }
          setResolucionValue(selection)
          setRazon('')
          break
        case 'isExplained':
          setRazon(selection)
    }

    if(razon.length>=20) setMarkError(false)
  }

    const validateData = ():boolean => {
      // validamos que la caja de texto no este vacia
      if(!razon) {
       setMarkError(true) // error en la caja de texto
       notify('La caja de texto está vacia', {type:'error'})
       return false

       // validamos que el input tenga al menos una longitud igual o mayor a 20
      } else if(razon.length < 20) {
        notify('La longitud de la explicación debe de ser de al menos 20 caractéres', {type:'error'})
        return false
      }
      return true
    }

    const handleSave = () => {
      
      // solicitud para archivar el reporte

      const data = {
        reporteId: id, 
        estatus: estado, 
        resolucion: resolucionValue, 
        razon
      }

      create('archivados', 
              { data },
              {
                onSuccess: () => {
                  refresh()
                  notify('El reporte se ha archivado correctamente.', {type: 'success'})
                  // redirect('/archivados')
                },
                onError: () => {
                  notify('Ha ocurrido un error Archivando el reporte. Intente más tarde', {type: 'error'})
                },
                onSettled: () => setOpen(false)
              }
            )
        
    } 
  
  if(error) notify("Ha ocurrido un error, Intente más tarde.")
  return (
    <div>
      <Button 
       className = "actualizarBtn"
       size="small"
       onClick={handleOpen}
       disabled={isLoading}
       sx={{ padding: '7px', color: 'black',  backgroundColor: '#F0FFF0', '&:hover': {
        transform: 'scale(1.1)',
        backgroundColor: '#F0FFF0'
    }}}>
        Actualizar Estatus
      </Button>

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container direction='column' sx ={{backgroundColor:''}} >
          {/* titulo de la seccion */}
          <Grid container item xs={12} direction='row' justifyContent="space-between" alignItems="center" sx = {{height:'20%'}}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
              Actualización de Estatus
            </Typography>
            <Button onClick = {handleClose} sx = {{backgroundColor:''}}>
                <CloseIcon />
            </Button>
          </Grid>

          <Divider sx = {{backgroundColor:'lightgrey', mt:2, mb:2}} />

          {/* Sección para la selección del estatus */}
          <Grid container item direction='column' xs = {12} sx={{height:'80%'}}>
            <FormControl>
              <FormLabel id="controlled-radio-buttons-group" sx ={{color: 'white', ml:1.5}}>Actualiza el estatus del Reporte {`"${titulo}":`}</FormLabel>
              
              <RadioGroup
                aria-labelledby="controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={estado}
                onChange={(e) => handleChange(e, 'isCompleted')}
              >
                <Grid container justifyContent='space-around' sx ={{mt:1}} >
                  <FormControlLabel value="pendiente" control={<Radio sx={{color: 'white'}}/>} label="pendiente" />
                  <FormControlLabel value="completado" control={<Radio sx={{color: 'white'}} />} label="completado" />
                </Grid>
              </RadioGroup>
            </FormControl>

            
            {completado ? 
            (
            <>
            <Divider sx ={{backgroundColor:'lightgrey', mt:2, mb:2}} />
            <Grid container item justifyContent='space-between' alignItems = 'center'>
            <FormControl>  
              <Grid container item direction='row' justifyContent='space-between' alignItems = 'center'>
                <FormLabel id="controlled-radio-buttons-group" sx ={{color: 'white', ml:1.5 }}>¿Se le dió solución al incidente?</FormLabel>
                <RadioGroup
                value={resolucionValue}
                onChange={(e) => handleChange(e, 'isResolved')}
                sx = {{ml:2}}>
                  <Grid container direction='row'>
                    <FormControlLabel value = "Resuelto"  control={<Radio />} label="Si" />
                    <FormControlLabel value = "No Resuelto"  control={<Radio />} label="No" />
                  </Grid>
                </RadioGroup>
              </Grid>
            </FormControl>

            </Grid>
            </>): null}

            {
              (completado && resolucion) ? 
              (
                <>
                  <Divider sx ={{backgroundColor:'lightgrey', mt:2, mb:2}} />
                  <Grid container item>
                    <Typography variant = "subtitle1" sx = {{ml: 2}}>Indica como se resolvió el Incidente:</Typography>
                    <Grid container item justifyContent='center'>
                      <TextField
                        required
                        value = {razon}
                        onChange = {(e) => handleChange(e, 'isExplained')}
                        id="outlined-multiline-flexible"
                        variant="outlined"
                        multiline
                        rows={5}
                        sx = {{width: '80%', bgcolor: 'white'}}
                        placeholder="razón"
                        error = {markError}
                        />
                    </Grid>
                    
                    <ConfirmacionDialog message={"Esta acción archivará el reporte con el estatus actualizado.\n Una vez archivado, el reporte ya no se puede editar. ¿Desea Continuar?"} onContinue={handleSave} validateData={validateData} />

                  </Grid>
                </>
              ) :
              ((completado && !resolucion) && flag) ? 
              (
                <>
                  <Divider sx ={{backgroundColor:'lightgrey', mt:2, mb:2}} />
                  <Grid container item>
                    <Typography variant = "subtitle1" sx = {{ml: 2}}>Indica porque no se pudo dar solución al incidente:</Typography>
                    <Grid container item justifyContent='center'>
                      <TextField
                        required
                        value = {razon}
                        onChange = {(e) => handleChange(e, 'isExplained')}
                        id="outlined-multiline-flexible"
                        variant="outlined"
                        multiline
                        rows={5}
                        sx = {{width: '80%', bgcolor: 'white'}}
                        placeholder="razón"
                        error = {markError}

                        />
                    </Grid>
                    
                    <ConfirmacionDialog message={"Esta acción archivará el reporte con el estatus actualizado.\n Una vez archivado, el reporte ya no se puede editar. ¿Desea Continuar?"} onContinue={handleSave} validateData={validateData} />

                  </Grid>
                </>
              ) : null
            }

          </Grid> 
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}


export default Reportes;