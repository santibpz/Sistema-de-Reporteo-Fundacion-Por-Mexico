// endpoints para subcategorias

import {ObjectId} from 'mongodb';

const prefix = "/subcategorias";
const dbCollection = "subcategorias";

export function addEndpoints(app, conn) {
    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    app.get(prefix + "/:id", async (req, res) => {
        try {
            // conexion con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);

            try {
                // query a la base de datos apra obtener la informacion de las subcategorias en base al id de la categoria que se selecciona
                const data = await db
                             .find({categoria: new ObjectId(req.params.id)})
                             .project({_id: 0, id: "$_id", nombre: 1})
                             .toArray()

                // exponer el header Content-Range para que el cliente pueda saber cuantos elementos hay en la lista
                res.set('Access-Control-Expose-Headers', 'Content-Range');
                res.set('Content-Range', data.length);
                res.json(data); 
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {  
                dbConn.close();
            }   
        } catch (error) {   
            console.error('Error:', error);
            // next(error); 
        }
    })}      
