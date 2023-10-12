"use strict"

import config from './utils/config.js'
import middleware from './utils/middleware.js';
import * as Usuarios from './endpointUsuarios.js';
import * as Aulas from './endpointAulas.js';
import * as Incidentes from './endpointIncidencia.js';
import * as Archivados from './endpointArchivados.js';
import * as TiposDeIncidentes from './endpointTiposDeIncidencia.js';
import * as Categorias from './endpointCategorias.js';
import * as Subcategorias from './endpointSubcategorias.js';
import * as ReporteSemanal from './endpointReporteSemanal.js';
import * as Auth from './endpointAuth.js';
import * as Comentarios from './endpointComentarios.js';
import * as Charts from './endpointCharts.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './utils/logger.js';
import { connDB } from './utils/DBUtils.js';
import { networkInterfaces } from 'os';

// import https from 'https'
// import fs from 'fs';

// cosas del loggeo
// cambiar con .env
let consoleLogLevel = config.CONSOLE_LOG_LEVEL;
let dbLogLevel = config.DB_LOG_LEVEL;

if (consoleLogLevel == null) {
    consoleLogLevel = 3;
}

if (dbLogLevel == null) {
    dbLogLevel = -1;
}

logger.setConsoleLogLevel(consoleLogLevel);
logger.setDBLogLevel(dbLogLevel);
logger.info("SYS", "Iniciando nueva instancia del servidor", "app.js");

// inicializacion de express
const app=express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(middleware.requestLogger);


// manejadores de todos los endpoints de la API
Usuarios.addEndpoints(app, connDB);
Aulas.addEndpoints(app, connDB);
Incidentes.addEndpoints(app, connDB);
Archivados.addEndpoints(app, connDB);
TiposDeIncidentes.addEndpoints(app, connDB);
Categorias.addEndpoints(app, connDB);
Subcategorias.addEndpoints(app, connDB);
ReporteSemanal.addEndpoints(app, connDB);
Auth.addEndpoints(app, connDB);
Comentarios.addEndpoints(app, connDB);
Charts.addEndpoints(app, connDB);

// middleware de errores y rutas no encontradas
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// correr cuando se pare el app
process.on('SIGINT', () => {
    const prom = logger.info("SYS", "Deteniendo instancia del servidor", "app.js");
    prom.finally(() => {
        process.exit();
    });
});

// inicializacion del servidor
app.listen(config.PORT, async () => {
    await connDB();
    // get the current ip address on where the server is hosted
    const nets = networkInterfaces();
    const results = Object.create(null); // or just '{}', an empty object
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // skip over non-ipv4 and internal (i.e. localhost) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    // get the fist ip address from results
    let ip = "";
    if (Object.keys(results).length == 0) {
        logger.warn("SYS", "No se pudo obtener la direccion IP del servidor", "app.js");
        ip = "http://localhost";
    }
    else {
        if (results[Object.keys(results)[0]].length == 0) {
            logger.warn("SYS", "La interfaz del servidor no cuenta con IP. Usando localhost.", "app.js");
            ip = "http://localhost";
        }
        else
        {
            ip = results[Object.keys(results)[0]][0];
        }
    }

    logger.info("SYS", `Iniciado nueva instancia del servidor en: ${ip}:${config.PORT}`, "app.js");
});


// certificados

// https.createServer({cert: fs.readFileSync("back.cer"), key: fs.readFileSync("back.key")}, app).listen(8081, async ()=>{
//     await connDB();
//     console.log("Servidor escuchando en puerto 8081")
// })