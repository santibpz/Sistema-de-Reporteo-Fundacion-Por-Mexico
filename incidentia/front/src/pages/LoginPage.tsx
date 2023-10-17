import { useState } from 'react'
import { useLogin, useNotify } from 'react-admin';
import { Box, Grid, Paper, Avatar, TextField, Button, Typography, Link} from "@mui/material"
import image from '../images/FXM_B_sinFondo.png'

// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

const LoginPage = () => {

    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin()
    const notify = useNotify()

    const paperStyle={
        padding:20,
        height: "60vh",
        width: 350,
        margin: "70px auto",
        borderRadius: "20px",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
    }

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        login({matricula, password })
         .then(() => notify('Acceso Autorizado', {type: 'success'}))
         .catch((error) => {
         notify('Credenciales Inválidas', {type: 'error'})
        })
    }
    return(
        <div style={{height: "maxHeight", display:'flex', backgroundColor:'#69B035'}}>
        <Grid container alignItems="center" justifyContent="center">
        <Grid item>
            <img src={image} alt="logo"/>
        </Grid>
        <Grid container direction="column" alignItems="center">
            <Paper style = {paperStyle}>
                <Grid 
                className = 'login'
                container
                spacing = {2}
                style = {{padding: 20}}
                justifyContent="center"
                alignItems="center"
                >

                    <Grid item align = 'center' style={{color:"#69B035"}}>
                        <h2>Iniciar Sesión</h2>
                    </Grid>
                    <Grid style = {{padding: 20}} item>
                        <TextField sx = {{marginBottom: 1}}
                         value={matricula}
                         onChange={(e) => setMatricula(e.target.value)}
                         label = 'Matrícula'
                         placeholder='Matrícula' 
                         required
                         fullWidth
                         >
                         </TextField>
                        <TextField sx = {{marginBottom: 2}}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label = 'Contraseña' 
                        placeholder='Contraseña' 
                        type = 'password' 
                        required 
                        fullWidth></TextField>
                        <Button 
                        onClick={handleSubmit}
                        sx = {{backgroundColor: 'blue'}} 
                        variant = 'contained' 
                        fullWidth>Entrar</Button>
                    </Grid>
                </Grid>
            </Paper>
            </Grid>
        </Grid>
    </div>    
    )
}

export  default LoginPage