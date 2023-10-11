import {defaultTheme} from "react-admin";

export const handleThemeChange = () => {
  setTheme(theme === lightTheme ? darkTheme : lightTheme);
};

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
  "Trabajadores de Aula": '#6D9C84', // Verde Pastel más oscuro
  "Inmobiliario": '#E57373', // Rojo Pastel más oscuro
  "Equipo Tecnológico": '#6F90B0', // Azul Pastel más oscuro
  "Infraestructura": '#E3BAC9', // Rosa Pastel más oscuro
  "Material Académico": '#E3C46A', // Naranja Pastel más oscuro
  "Beneficiarios": '#6DA19C', // Aqua Pastel más oscuro
  "Otros": '#B58FB4' // Morado Pastel más oscuro
}

export const lightTheme = {
    ...defaultTheme,
    palette: {
        mode: "light",
        ...lightPalette,
    }
};
    
export const darkTheme = {
      ...lightTheme,
      palette: {
        mode: 'dark',
        ...darkPalette,
      }
};