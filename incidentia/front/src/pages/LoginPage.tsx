import { useState } from 'react'
import { useLogin, useNotify } from 'react-admin';
import { Grid, Paper, Avatar, TextField, Button, Typography, Link} from "@mui/material"

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
        margin: "70px auto"
    }

    const handleSubmit = (e: Event) => {
        e.preventDefault();

        login({matricula, password })
        .catch(() => notify('Matrícula o Contraseña equivocada'))


    }
    return(
                          
            <Paper  style = {paperStyle}>
                <Grid 
                container
                spacing = {2}
                style = {{padding: 20}}
                justifyContent="center"
                alignItems="center">

                    <Grid item align = 'center'>
                        <Avatar sx = {{backgroundColor: 'black'}}></Avatar>
                        <h2>Iniciar Sesión</h2>
                    </Grid>
                    <Grid item>
                        <TextField
                         value={matricula}
                         onChange={(e) => setMatricula(e.target.value)}
                         label = 'Matrícula'
                         placeholder='Matrícula' 
                         required
                         fullWidth>
                         </TextField>
                        <TextField 
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
                        <Typography style = {{paddingTop: 5, margin: 'auto'}}>
                        <Link href="#" sx = {{textDecoration: 'none'}}>
                            Olvidé mi contraseña
                        </Link>
                    </Typography>
                    </Grid>

                </Grid>
            </Paper>
    )
}

export  default LoginPage