import mongo from 'mongodb';
import logger from './logger.js';
import config from './config.js';

// conexion con la base de datos
export async function connDB(){
    let client = new mongo.MongoClient(config.MONGODB_URI);
    await client.connect();
    
    return {conn: client, db: client.db('Incidentia')};
}