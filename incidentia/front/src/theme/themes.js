import { createTheme } from '@mui/material/styles';

const lightPalette = {
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

  export const darkColorCategoria = {
    "Trabajadores de Aula": '#4CAF50', // Verde oscuro
    "Inmobiliario": '#D32F2F', // Rojo oscuro
    "Equipo Tecnológico": '#1976D2', // Azul oscuro
    "Infraestructura": '#E91E63', // Rosa oscuro
    "Material Académico": '#FF9800', // Naranja oscuro
    "Beneficiarios": '#009688', // Verde azul oscuro
    "Otros": '#8E24AA' // Morado oscuro
  };
  

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