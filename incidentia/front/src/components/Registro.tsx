import React, {useState, useEffect, useRef} from "react";
import axios from 'axios';
import { Grid, Paper, Avatar, TextField, Button, Typography, 
        Link, FormControl, FormControlLabel, FormGroup, Checkbox, InputLabel, Select, MenuItem, Box} from "@mui/material"
import { Create, useNotify, useRedirect } from 'react-admin';
import Multiselect from 'multiselect-react-dropdown';
import ConfirmacionDialog from "./ConfirmacionDialog";
import img from '../images/logo-fundacion-por-mexico.png'


const CoordinadorCreate = () => {
    return(
        <Create>
        </Create>
    )
}

export const Registro = () =>{
    const notify = useNotify()
    const redirect = useRedirect()
    const ConfirmacionDialogRef = useRef(null)
    const roles = ['Aula', 'Nacional'];

    const paperStyle={
        // padding:10,
        // height: "80vh",
        width: 350,
        margin: "30px auto"
    }

    const [aulas, setAulas] = useState([])
    const [isCoordinadorAula, setIsCoordinadorAula] = useState(false)
    const [isCoordinadorNacional, setIsCoordinadorNacional] = useState(false)

    const [datos, setDatos]=useState({
        fullName: "",
        username: "",
        password: "",
        rol: "",
    });
    const [aulaSeleccionada, setAulaSeleccionada] = useState('')
    const [aulasSeleccionadas, setAulasSeleccionadas] = useState<string[]>([])

    const handleChange= (event: { target: { name: any; value: any; }; })=> {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value,
        });
        event.target.value === 'Aula' ? setIsCoordinadorAula(true) : setIsCoordinadorAula(false);
        event.target.value === 'Nacional' ? setIsCoordinadorNacional(true) : setIsCoordinadorNacional(false);
    };

    const handleSendData = async() => {
        // Convert the form data to JSON
        
        const baseData = {nombreCompleto: datos.fullName, matricula: datos.username, password: datos.password, rol: datos.rol }

        let data = {}
        if(baseData.rol == 'Aula') {
          
            data={
                ...baseData,
                aulaId: aulaSeleccionada
            }
        } else if(baseData.rol == 'Nacional') {
          
            data={
                ...baseData,
                aulasId: aulasSeleccionadas
            }
        }

        return axios.post(import.meta.env.VITE_SIMPLE_REST_URL + "/registro", data, {
            headers: {
              authorization: localStorage.getItem('auth')
            }
          })
        .then(response => {
            notify(response.data.message, {type:'success'})
            setTimeout(() => {
            redirect('/coordinadores')
            }, 1500)
        })
        .catch(error => {
            console.log("Error comp", error)
            ConfirmacionDialogRef.current != null ? ConfirmacionDialogRef.current.handleClose():null
            notify(error.response.data.error, {type: 'error'})
        });       
    };

    const onSelect = (selectedList:any, selectedItem:{nombre:string, id:string}) => {
        const {id} = selectedItem;
        console.log(selectedItem.nombre)
        setAulasSeleccionadas([...aulasSeleccionadas, id])
    }

    const onRemove = (selectedList:any, removedItem:{nombre:string, id:string}) => {
        const {id:removedId} = removedItem;
        console.log(removedItem.nombre)
        setAulasSeleccionadas(aulasSeleccionadas.filter((id:string) => id != removedId));
    }

    useEffect(() => {
        const fetchAulas = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SIMPLE_REST_URL}/aulas`)
                const {data} = response
                setAulas(data)

            } catch(err:any) {
                notify(err.response.data.error, {type:'error'})
                setTimeout(() => redirect('/coordinadores'), 2000)
                
            }
        }
        fetchAulas()
    }, [])
        return(
                            
            <Paper  style = {paperStyle}>
                <Grid 
                className = 'login'
                container
                direction='column'
                justifyContent="center"
                alignItems="center">
                    <Grid container item justifyContent='space-around' alignItems='center' xs={1} sx = {{bgcolor:'', p:0.7}}> 
                        <img src={img} style={{width:'60px', height:'50px'}} />
                        <h3>Registro Coordinadores</h3>
                    </Grid>
                    <Grid container item justifyContent='' xs ={10} sx ={{p:2}}>
                        <TextField
                        name="fullName"
                        value={datos.fullName}
                        onChange={handleChange}
                        label="nombre completo"
                        placeholder="nombre completo"
                        required
                        fullWidth
                        />
                        <TextField
                        name="username"
                        value={datos.username}
                        onChange={handleChange}
                        label="Matrícula"
                        placeholder="Matrícula"
                        required
                        fullWidth

                        />
                        <TextField 
                        name="password"
                        value={datos.password}
                        onChange={handleChange}
                        label="Contraseña" 
                        placeholder="Contraseña" 
                        type="password" 
                        required 
                        fullWidth

                        />
                        <InputLabel>Rol</InputLabel>
                        <Select
                            required
                            fullWidth
                            name="rol"
                            value={datos.rol}
                            onChange={handleChange}>
                            {roles.map((rol) => (
                            <MenuItem key={rol} value={rol}>
                                {rol}
                            </MenuItem>
                            ))}
                        </Select>

                        <Box sx = {{display: isCoordinadorAula ? '':'none', width: '100%', mt:1}}>
                            <InputLabel>Aula Asignada</InputLabel>
                            <Select
                                required
                                name="Aula"
                                value={aulaSeleccionada}   
                                onChange={(e) => setAulaSeleccionada(e.target.value)}
                                fullWidth
                                sx ={{height:40}}>
                                {aulas.map(({id, nombre}) => (
                                <MenuItem key={id} value={id}>
                                    {nombre}
                                </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx = {{display: isCoordinadorNacional ? '':'none', width:'100%', mt:1}}>
                            <InputLabel>Selecciona Aulas Gestionadas</InputLabel>
                            <Multiselect
                            options={aulas} // Opciones
                            onSelect={onSelect} 
                            onRemove={onRemove}
                            displayValue="nombre" 
                            />
                        </Box>

                        <Box sx={{mt:2, width:'100%'}}>
                        <ConfirmacionDialog message="Se recomienda Registrar las Credenciales 'Matricula' y 'Contraseña' para que el usuario pueda iniciar sesión con las mismas." 
                                            onContinue={handleSendData}
                                            ref = {ConfirmacionDialogRef} />
                        </Box>
                    </Grid>

                </Grid>
            </Paper>
    )
};

export default CoordinadorCreate;