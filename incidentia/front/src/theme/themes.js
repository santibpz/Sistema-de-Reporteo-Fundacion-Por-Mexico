import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import {Grid, Chip} from '@mui/material';

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
    "Trabajadores de Aula": '#28A745', // Verde vibrante
    "Inmobiliario": '#DC3545', // Rojo vibrante
    "Equipo Tecnológico": '#007BFF', // Azul vibrante
    "Infraestructura": '#FF0066', // Rosa vibrante
    "Material Académico": '#FF8800', // Naranja vibrante
    "Beneficiarios": '#00B894', // Aqua vibrante
    "Otros": '#A355D7' // Morado vibrante
  }  

export const lightMainColor = {
    "Trabajadores de Aula": '#69B035',
    "Inmobiliario": '#69B035',
    "Equipo Tecnológico": '#69B035',
    "Infraestructura": '#69B035',
    "Material Académico": '#69B035',
    "Beneficiarios": '#69B035',
    "Otros": '#69B035'
}

export const darkColorCategoria = {
    "Trabajadores de Aula": '#4CAF50', // Verde oscuro
    "Inmobiliario": '#D32F2F', // Rojo oscuro
    "Equipo Tecnológico": '#1976D2', // Azul oscuro
    "Infraestructura": '#E91E63', // Rosa oscuro
    "Material Académico": '#FF9800', // Naranja oscuro
    "Beneficiarios": '#009688', // Verde azul oscuro
    "Otros": '#8E24AA' // Morado oscuro
};

export const darkMainColor = {
    "Trabajadores de Aula": '#1C8D41',
    "Inmobiliario": '#1C8D41',
    "Equipo Tecnológico": '#1C8D41',
    "Infraestructura": '#1C8D41',
    "Material Académico": '#1C8D41',
    "Beneficiarios": '#1C8D41',
    "Otros": '#1C8D41'
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

export const StyledChip= styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#69B035' : '#1C8D41',
}));

export const StyledBackgroundGrid = styled(Grid)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'light' ? '#EEE' : '#888',
        borderRadius: "20px"
    }));