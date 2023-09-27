import React, {useState} from "react";
import axios from 'axios';
import { Grid, Paper, Avatar, TextField, Button, Typography, 
        Link, FormControl, InputLabel, Select, MenuItem} from "@mui/material"

const Registrarse = () =>{

    const roles = ['Aula', 'Nacional', 'Ejecutivo'];

    const paperStyle={
        padding:20,
        height: "70vh",
        width: 350,
        margin: "70px auto"
    }

    const [datos, setDatos]=useState({
        fullName: "",
        username: "",
        password: "",
        rol: "",
    });

    const handleChange= (event: { target: { name: any; value: any; }; })=>{
        setDatos({
            ...datos,
            [event.target.name]: event.target.value,
        });
    };

    const handleSendData = async() => {
        // Convert the form data to JSON
        return axios.post('http://localhost:8081/registrarse', {Fname: datos.fullName, matricula: datos.username, password: datos.password, rol: datos.rol })
        .then(response => {
            return Promise.resolve();
        })
        .catch(error => {
            return Promise.reject();
        });       
    };
        return(
                            
            <Paper  style = {paperStyle}>
                <Grid 
                className = 'login'
                container
                spacing = {2}
                style = {{padding: 20}}
                justifyContent="center"
                alignItems="center">

                    <Grid item align = 'center'>
                        <Avatar sx = {{backgroundColor: 'black'}}></Avatar>
                        <h2>Registrarse</h2>
                    </Grid>
                    <Grid item>
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
                        <FormControl fullWidth required>
                        <InputLabel>Rol</InputLabel>
                        <Select
                            name="rol"
                            value={datos.rol}
                            onChange={handleChange}>
                            {roles.map((rol) => (
                            <MenuItem key={rol} value={rol}>
                                {rol}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <Button 
                        onClick={handleSendData}
                        sx = {{backgroundColor: 'blue'}} 
                        variant = 'contained' 
                        fullWidth>Entrar</Button>
                        <Typography style = {{paddingTop: 5, margin: 'auto'}}>
                        <Link href="#" sx = {{textDecoration: 'none'}}>
                            Iniciar sesión
                        </Link>
                    </Typography>
                    </Grid>

                </Grid>
            </Paper>
    )
};

export default Registrarse;