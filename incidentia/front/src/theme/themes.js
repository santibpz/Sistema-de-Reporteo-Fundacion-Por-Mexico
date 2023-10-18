import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import {Grid, Chip, Typography} from '@mui/material';
import logo from '../images/FXM_sinFondo.png'
import whitelogo from '../images/FXM_B_PNG.png'

const lightPalette = {
    primary: {
        main: "#69B035",
    },
    secondary: {
        main: "#69B035",
    },
    error: {
        main: "#BA1015",
    },
}

const darkPalette = {
    primary: {
        main: "#1C8D41",
    },
    secondary: {
        main: "#1C8D41",
    },
    error: {
        main: "#BA1015",
    },
}

export const lightColorCategoria = {
    "Recursos humanos": '#28A745', // Verde vibrante
    "Mobiliario": '#DC3545', // Rojo vibrante
    "Digital": '#007BFF', // Azul vibrante
    "Infraestructura": '#FF0066', // Rosa vibrante
    "Materiales": '#FF8800', // Naranja vibrante
    "Beneficiarios": '#00B894', // Aqua vibrante
    "Seguridad": '#A355D7', // Morado vibrante
    "Fenómeno meteorológico": '#800020' // Vino vibrante
}


export const lightMainColor = {
    "Recursos humanos": '#69B035',
    "Mobiliario": '#69B035',
    "Digital": '#69B035',
    "Infraestructura": '#69B035',
    "Materiales": '#69B035',
    "Beneficiarios": '#69B035',
    "Seguridad": '#69B035',
    "Fenómeno meteorológico": '#69B035'
}

export const darkColorCategoria = {
    "Recursos humanos": '#4CAF50', // Verde oscuro
    "Mobiliario": '#D32F2F', // Rojo oscuro
    "Digital": '#1976D2', // Azul oscuro
    "Infraestructura": '#E91E63', // Rosa oscuro
    "Materiales": '#FF9800', // Naranja oscuro
    "Beneficiarios": '#009688', // Verde azul oscuro
    "Seguridad": '#8E24AA', // Morado oscuro
    "Fenómeno meteorológico": '#500000' // Vino oscuro
};

export const darkMainColor = {
    "Recursos humanos": '#1C8D41',
    "Mobiliario": '#1C8D41',
    "Digital": '#1C8D41',
    "Infraestructura": '#1C8D41',
    "Materiales": '#1C8D41',
    "Beneficiarios": '#1C8D41',
    "Seguridad": '#1C8D41',
    "Fenómeno meteorológico": '#1C8D41'
}
  

export const theme = createTheme({
    palette: {
        mode: "light",
        ...lightPalette,
    }
});
    
export const darkTheme = createTheme({
      palette: {
        mode: 'dark',
        ...darkPalette,
      }
});

export const StyledGrid = styled(Grid)(({ theme, categoria, disableColors }) => {
    let colorCategoria, mainColor;

    if (disableColors) {
        mainColor = theme.palette.mode === 'light' ? lightMainColor[categoria] : darkMainColor[categoria];
        colorCategoria = mainColor; // Usar color principal cuando disableColors está activado
    } else {
        colorCategoria = theme.palette.mode === 'light' ? lightColorCategoria[categoria] : darkColorCategoria[categoria];
    }

    return {
        backgroundColor: colorCategoria,
    };
});

export const StyledLogo = styled('img')(({ theme }) => ({
    content: `url(${theme.palette.mode === 'light' ? logo : whitelogo})`,
  }));

export const StyledChip= styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#69B035' : '#1C8D41',
}));

export const StyledTypography= styled(Typography)(({ theme }) => ({
    color: theme.palette.mode === 'light' ? '#69B035' : '#1C8D41',
}));

export const StyledBackgroundGrid = styled(Grid)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'light' ? '#EEE' : '#888',
        borderRadius: "20px"
    }));