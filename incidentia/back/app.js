"use strict"

import config from './utils/config.js'
import middleware from './utils/middleware.js';
import * as Usuarios from './endpointUsuarios.js';
import * as Aulas from './endpointAulas.js';
import * as Incidentes from './endpointIncidencia.js';
import * as TiposDeIncidentes from './endpointTiposDeIncidencia.js';
import * as Categorias from './endpointCategorias.js';
import * as Subcategorias from './endpointSubcategorias.js';
import * as ReporteSemanal from './endpointReporteSemanal.js';
import express from 'express';
import bodyParser from 'body-parser';
import mongo from 'mongodb';
import cors from 'cors';

// inicializacion de express
const app=express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(middleware.requestLogger)

// conexion con la base de datos
async function connDB(){
    let client = new mongo.MongoClient(config.MONGODB_URI);
    await client.connect();
    
    return {conn: client, db: client.db('Incidentia')};
}

// manejadores de todos los endpoints de la API
Usuarios.addEndpoints(app, connDB);
Aulas.addEndpoints(app, connDB);
Incidentes.addEndpoints(app, connDB);
TiposDeIncidentes.addEndpoints(app, connDB);
Categorias.addEndpoints(app, connDB);
Subcategorias.addEndpoints(app, connDB);
ReporteSemanal.addEndpoints(app, connDB);

// middleware para manejar endpoints inexistentes y errores
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler) 


// inicializacion del servidor
app.listen(config.PORT, async () => {
    await connDB();
    console.log(`Server is running on port ${config.PORT}`)
});


   




