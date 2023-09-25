import { ObjectId } from 'mongodb';
import { mainPipeline, findOnePipeline } from './utils/pipelines.js';

const prefix = "/reportes";
const dbCollection = "reportes";   
        
export function addEndpoints(app, conn) {   
    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    app.get(prefix + "", async (req, res) => {  
        // cosas de todos los endpoints
        try { 
            // conn con db   
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);


            try {


                // el query a la base de datos que obtiene la informacion a enviar al cliente
                const queryCursor = await db.aggregate(mainPipeline)

                // convertimos el resultado del query a un arreglo con todos los objetos que representan cada reporte
                let data = await queryCursor.toArray()

                res.set('Access-Control-Expose-Headers', 'Content-Range');
                res.set('Content-Range', data.length);
                                                 
                res.status(200).json(data);
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
    });

    // getOne 	            GET localhost/Prefix/123
    app.get(prefix + "/:id", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);

            // cosas del endpoint
            try {  
                console.log(req.params.id)

                const pipeline = findOnePipeline(new ObjectId(req.params.id))

                const queryCursor = await db.aggregate(pipeline)
                let data = await queryCursor.toArray()

                // if (!result) {
                //     res.status(404).json({ error: 'Resource not found' });
                //     return; 
                // }

                data.length > 1 ?   
                res.status(404).json({ error: 'Hubo un problema encontrando con la visualización de reporte' }) :
                res.json(data[0]);

            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                dbConn.close();
            }
        } catch (error) {
            console.error('Error:', error);
            next(error);
        }
    });

    // getMany 	            GET localhost/Prefix?filter={"ids":[123,456,789]}
    // app.get(prefix + "/:_id", async (req, res) => {
    //     // cosas de todos los endpoints
    //     try {
    //         // conn con db
    //         let dbFig = await conn();
    //         let dbConn = dbFig.conn;
    //         let db = dbFig.db.collection(dbCollection);

    //         // cosas del endpoint
    //         try {
    //             const query = {id: parseInt(req.params._id)};

    //             const result = await db.find(query);

    //             if (!result) {
    //                 res.status(404).json({ error: 'Resource not found' });
    //                 return;
    //             }

    //             res.json(result);
    //         } catch (error) {
    //             console.error('Error:', error);
    //             res.status(500).json({ error: 'Internal server error' });
    //         } finally {
    //             dbConn.close();
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //         return;
    //     }
    // });

    // getManyReference 	GET localhost/Prefix?filter={"author_id":345}

    // app.post(prefix + "/", async (req, res) => {
    //     try{
    //         let dbFig = await conn();
    //         let dbConn = dbFig.conn;
    //         let db = dbFig.db.collection(dbCollection);
    //         const data = req.body
    //         let result = await db.insertOne(data)
    //         console.log(result)
    //     } catch(err) {
    //         console.log(err)
    //     }
    // })
    
    // create 	            POST localhost/Prefix
    app.post(prefix + "", async (req, res, next) => {
        try {
            const dbFig = await conn();
            const dbConn = dbFig.conn; // client
            const db = dbFig.db.collection(dbCollection); 
    
            try {
    
                const data = req.body

                const reporte = {
                    ...data,
                    categoria: new ObjectId(data.categoria), 
                    subcategoria: new ObjectId(data.subcategoria),
                    estatus: "pendiente",
                    comentarios: [],
                    fecha: new Date()   
                }
                const result = await db.insertOne(reporte);
    
                if (result.insertedId) {
                    res.status(201).json({id: result.insertedId}); // 201 Created
                } else {
                    res.status(500).json({ error: 'Failed to create the resource' });
                }          
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'No se pudo crear el Reporte' });
            } 
            finally {
                dbConn.close();
            }
        } catch (error) {
            console.error('Error:', error);
            next(error); // Pass the error to the error handling middleware
        }
    });

    // update 	            PUT localhost/Prefix/123
    app.put(prefix + "/:id", async (req, res) => {
        try {
            // conexión con la base de datos
            const dbFig = await conn();
            const dbConn = dbFig.conn; // client
            const db = dbFig.db.collection(dbCollection)

            // obtener la informacion del cuerpo de la solicitud
            const { estatus } = req.body
            const result = await db.updateOne({_id: new ObjectId(req.params.id)}, { $set: { estatus } })
            console.log(result)  

            result.modifiedCount === 1 ?
            res.status(200).json({id: req.params.id}) :
            res.status(500).json({ error: 'Ocurrió un problema al modificar el estatus de. Reporte. Intentar más tarde' });

            dbConn.close();
           
        } catch (error) {
            console.error('Errorr:', error);          
            res.status(500).json({ error: 'Ocurrió un problema. Intentar más tarde' });
        } 
    });

    // delete 	            DELETE localhost/Prefix/123
    app.delete(prefix + "/:_id", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);

            // cosas del endpoint
            try {
                const result = await db.deleteOne({_id: new ObjectId.ObjectId(req.params._id)});

                res.json(result.deletedCount);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                dbConn.close();
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    });
  
};