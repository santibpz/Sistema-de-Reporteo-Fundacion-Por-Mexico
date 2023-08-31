/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'Incidentia';

// Create a new database.
use(database);

// Create a new collection.
db.createCollection("Usuarios");
db.createCollection("Aulas");
db.createCollection("Incidencia");
db.createCollection("TiposDeIncidencia");

db.TiposDeIncidencia.insertOne({
    "Version": 1,
    "Infraestructura": [
        "Mantenimiento",
        "Servicios",
        "Imagen",
        "Seguridad",
        "Daño"
    ],
    "Inmobiliario": [
        "Mantenimiento",
        "Robo",
        "Imagen",
        "Daño"
    ],
    "Equipo Tecnológico": [
        "Mantenimiento",
        "Robo",
        "Solicitud de programa"
    ],
    "Trabajadores": [
        "Negligencia",
        "Acoso",
        "Incidentes",
        "Salud"
    ],
    "Beneficiarios": [
        "Negligencia",
        "Acoso",
        "Incidentes",
        "Salud",
        "Solicitud académica"
    ],
    "Material Académico": [
        "Robo",
        "Daño",
        "Solicitud de material"
    ],
    "Otros": [
        "Otros"
    ]
})


db.Incidencia.insertOne({
    "id": 1, // id de la incidencia
    "estatus": "abierto", // abierto, cerrado, pendiente
    "fecha": "2019-05-20 10:30", // fecha de creacion
    "fechaUltimaActualizacion": "2019-05-20 10:30", // fecha de la ultima actualizacion
    "usuarioCreador": 1, // usuario que crea la incidencia (ID)
    "usuarioAsignado": 1, // usuario al que se le asigna la incidencia (ID)
    "aula": 1, // ID del aula en la que se encuentra la incidencia
    "tipo": "Prueba", // tipo de incidencia (en tiposincidencia.json)
    "subtipo": "Prueba", // subtipo de incidencia (en tiposincidencia.json, depende del tipo)
    "titulo": "Prueba 1", // titulo de la incidencia
    "descripcion": "Prueba 1", // descripcion de la incidencia
    "archivos": [ // archivos asociados a la incidencia
        {
            "usuario": "admin", // usuario que sube la imagen
            "fecha": "2019-05-20 10:30", // fecha de la imagen
            "imagen": "imagen1.jpg" // nombre de la imagen
        }
    ],
    "comentarios": [ // comentarios de la incidencia
        {
            "usuario": "admin", // usuario que comenta
            "fecha": "2019-05-20 10:30", // fecha del comentario
            "comentario": "Prueba 1" // comentario
        }
    ]
});

db.Usuarios.insertOne({
    "id": 1,
    "username": "johndoe",
    "nombre": "John",
    "apellido": "Doe",
    "permisos": [
        "admin",
        "user"
    ]
});

db.Aulas.insertOne({
    "id": 1,
    "ubicacion": "Calle 1",
    "salones": 2,
    "administradores": [
        1 // el ID del usaurio
    ]
});
