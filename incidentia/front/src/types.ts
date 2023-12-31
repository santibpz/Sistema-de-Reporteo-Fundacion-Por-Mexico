// Declaracion de tipos de datos para el proyecto

// declaracion de tipos de datos que conforman el reporte
export interface ReporteProps {
    id:string,
    coordinador: string,
    titulo: string,
    descripcion: string,
    categoria: string,
    subcategoria: string,
    prioridad: string,
    estatus: string,
    fecha: string,
    oficio?: string,
    fechaArchivado?: string,
    resolucion?: string,
    razon?: string,
    intermediarios?: Array<any>,
    tiempoResolucionDias: Number

}

// declaracion de tipos de datos que conforman el Comentario
export interface ComentarioProps {
    id:string,
    publicadoPor: string,
    comentario: string,
    fecha: string,
    refetchComentarios: () => void
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

// declaracion de tipos de datos que conforman la Ventana para actualzar el estatus del reporte
export interface ModalProps {
    titulo:string,
    estatus:string,
    id:string
  }
