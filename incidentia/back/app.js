"use strict"

import * as Usuarios from './endpointUsuarios.js';

import express from 'express';
import MongoCLient from 'mongodb';
import cors from 'cors';

const app=express();

app.use(cors());

async function connDB(){
    let client = new MongoCLient.MongoClient('mongodb://mongoadmin:bdung@localhost:27017/?authSource=admin&readPreference=primary&ssl=false&directConnection=true');
    await client.connect();
    
    return {conn: client, db: client.db('Incidentia')};
}

Usuarios.addEndpoints(app, connDB);

app.listen(8081, async () => {
    await connDB();
    console.log('Server is running on port 8081')
});
