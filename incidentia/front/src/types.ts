// Declaracion de tipos de datos para el proyecto

// declaracion de tipos de datos que conforman el reporte
export interface ReporteProps {
    titulo: string,
    descripcion: string,
    categoria: string,
    subcategoria: string,
    prioridad: string,
    estatus: string,
    fecha: string

}

// declaracion de tipos de datos que conforman la Categoria del reporte
export interface Categoria {
    id: string
    nombre: string
}

// declaracion de tipos de datos que conforman la Subcategoria del reporte
export interface Subcategoria {
    id: string
    nombre: string
}

