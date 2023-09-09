"use strict"

import * as Usuarios from './endpointUsuarios.js';
import * as Aulas from './endpointAulas.js';
import * as Incidentes from './endpointIncidencia.js';
import * as TiposDeIncidentes from './endpointTiposDeIncidencia.js';

import express from 'express';
import bodyParser from 'body-parser';
import MongoCLient from 'mongodb';
import cors from 'cors';

const app=express();

app.use(bodyParser.json());
app.use(cors());

async function connDB(){
    let client = new MongoCLient.MongoClient('mongodb://mongoadmin:bdung@localhost:27017/?authSource=admin&readPreference=primary&ssl=false&directConnection=true');
    await client.connect();
    
    return {conn: client, db: client.db('Incidentia')};
}

Usuarios.addEndpoints(app, connDB);
Aulas.addEndpoints(app, connDB);
Incidentes.addEndpoints(app, connDB);
TiposDeIncidentes.addEndpoints(app, connDB);

app.listen(8081, async () => {
    await connDB();
    console.log('Server is running on port 8081')
});
