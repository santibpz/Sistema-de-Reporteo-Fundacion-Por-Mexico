import {ObjectId} from 'mongodb';
import { verifyTokenFromReq } from './utils/JWTUtils.js';

const prefix = "/aulas";
const dbCollection = "aulas";

export function addEndpoints(app, conn) {
    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    app.get(prefix, async (req, res, next) => {
        // cosas de todos los endpoints
        try {
            const dbFig = await conn();
            const db = dbFig.db.collection(dbCollection);

             // verificar que solo coordinadores ejecutivo y nacional puedan acceder a este recurso
            const decodedToken = verifyTokenFromReq(req);

             // si el objeto decodedToken no tiene un campo id, el token no ha podido ser verificado porque expiró y se necesita volver a iniciar sesión
            if (!decodedToken.id)
                return res
                .status(401)
                .json({
                    error:
                    "Su sesión ha expirado, por favor inicie sesión nuevamente.",
                });

             // verificamos si el usuario accediendo es ejecutivo o nacional
            const coordinador = await dbFig.db.collection('coordinadores').findOne({_id: new ObjectId(decodedToken.id)})
            if(coordinador == null || coordinador.rol == 'Aula') return res.status(403).json({error: "No tienes permiso de Acceder."})

        
            let data = [] // informacion a enviar al cliente

            if(coordinador.rol == 'Nacional') {
                // hacemos un pipeline para poder obtener la información de las aulas que gestiona este coordinador
                const aulasNacionalPipeline = [
                    {$match: {_id: new ObjectId(decodedToken.id)}},
                    {$project: {aulas:1, _id: 0}}
                ]

                 // si el rol es nacional, buscar las aulas asociadas a este coordinador
                 let aulasCoordinadorNacional = await dbFig.db.collection('coordinadores').aggregate(aulasNacionalPipeline).toArray()
                 let aulasId = aulasCoordinadorNacional[0].aulas // arreglo con los ids de las aulas

                 // buscar todas las aulas que gestiona este coordinador
                 data = await db.find({
                    "_id": { $in: aulasId }
                  }).project({id:"$_id", _id: 0, nombre:1, direccion:1, numReportesPendientes: 1, numReportesArchivados: 1}).toArray()
            } 
            else if(coordinador.rol == 'Ejecutivo') {
                // si el rol es ejecutivo, buscar todas las aulas
                data = await db.find({}).project({id:"$_id", _id: 0, nombre:1, direccion:1,  numReportesPendientes: 1, numReportesArchivados: 1}).toArray()
            }

            // Agrega los headers de react-admin para que sepa cuantos hay de cuantos y en donde esta
            res.set("Access-Control-Expose-Headers", "Content-Range");
            res.set(
            "Content-Range",
            data.length
            );
          
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            res.status(500).json({error: "Ocurrió un error. Intente más tarde"})
        }
    });

    // getOne 	            GET localhost/Prefix/123
    app.get(prefix + "/:_id", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);

            // cosas del endpoint
            try {
                const query = {id: parseInt(req.params._id)};

                const result = await db.findOne(query);

                if (!result) {
                    res.status(404).json({ error: 'Resource not found' });
                    return;
                }

                res.json(result);
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

    
    // create 	            POST localhost/Prefix
    app.post(prefix + "", async (req, res, next) => {
        try {
            const dbFig = await conn();
            const dbConn = dbFig.conn;
            const db = dbFig.db.collection(dbCollection);
    
            try {
                // Validate and sanitize req.body here
                delete req.body._id;
                delete req.body.id;
        
                const result = await db.insertOne(req.body);
                dbConn.close();
        
                if (result.insertedId) {
                    res.status(201).json({ID: result.insertedId}); // 201 Created
                } else {
                    res.status(500).json({ error: 'Failed to create the resource' });
                }
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                dbFig.close();
            }
        } catch (error) {
            console.error('Error:', error);
            next(error); // Pass the error to the error handling middleware
        }
    });

    // update 	            PUT localhost/Prefix/123
    app.put(prefix + "/:_id", async (req, res) => {
        try {
            const dbFig = await conn();
            const db = dbFig.db.collection(dbCollection);
    
            // Validate the _id parameter
    
            // Validate and sanitize req.body here
    
            try {
                const result = await db.findOneAndUpdate(
                    { _id: new ObjectId.ObjectId(req.params._id) }, // Use _id for MongoDB document lookup
                    { $set: req.body }
                );
    
                if (result) {
                    res.json(result);
                } else {
                    res.status(404).json({ error: 'Resource not found' });
                }
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                dbFig.close();
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
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