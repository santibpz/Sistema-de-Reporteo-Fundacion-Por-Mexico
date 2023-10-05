// endpoints para comentarios
import { ObjectId } from 'mongodb';
import { verifyTokenFromReq } from './utils/JWTUtils.js';
import { comentariosPipeline } from './utils/pipelines.js';
const prefix = "/comentarios";
const dbCollection = "comentarios";

export function addEndpoints(app, conn) {
    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    app.get(`${prefix}/:id`, async (req, res) => {
        try {

            // conexion con db     
            let dbFig = await conn()   
            let db = dbFig.db.collection(dbCollection)

            // extraemos id
            const { id } = req.params

            // consultamos los comentarios del reporte con el id enviada en la solicitud
            const cursor = await db.aggregate(comentariosPipeline( new ObjectId(id)))

            const result = await cursor.toArray()
            
            // regresamos el resultado del query
            res.json(result) 

        } catch (error) {   
            console.error('Error:', error);
            res.status(500).json({error: "Ocurrió un error cargando los comentarios."})
        }
    })


    // post comments  
    app.post(prefix, async (req, res) => {
        try {
            // conexion con db    
            let dbFig = await conn();    
            let db = dbFig.db.collection(dbCollection);
           
            // obtenemos el token de la solicitud para saber quien está publicando el comentario
            const decodedToken = verifyTokenFromReq(req)

            // recibimos el id del reporte al que se le agrega el comentario y el contenido del comentario
            const {reporteId, comentario} = req.body

            // checar que el id del reporte al que se añadirá comentario sea valido
            if(new ObjectId(reporteId)) {

                // información del comentario
                const comentarioData = {
                    comentario,
                    reporte: new ObjectId(reporteId),
                    publicadoPor: new ObjectId(decodedToken.id),
                    fecha: new Date()    
                }

                // creamos el comentario en la colección comentarios
                const result = await db.insertOne(comentarioData)

                if(result.insertedId) {
                    res.status(201).json({id: result.insertedId})
                } else {
                    res.status(500).json({error: "No se pudo crear el comentario. Intente más tarde."})
                }
        }   
        
        } catch (error) {   
            res.status(500).json({ error: 'Ocurrió un error. Intente más tarde' });

        } 
    })

     // endpoint para actualizar el contenido de un comentario
     app.put(`${prefix}/:id`, async (req, res) => {
        try {    
            // conexion con db
            let dbFig = await conn();   
            let db = dbFig.db.collection(dbCollection); 
            const { id } = req.params
            const { comentario } = req.body

            const result = await db.updateOne({_id: new ObjectId(id)}, {$set: {comentario}})

            console.log("RRREEESSSUUUULLLTTT", result)

            if(result.modifiedCount == 1) {
                res.status(200).json({id})
            } else {
                res.status(500).json({error: "No se ha podido editar el comentario. Intente más tarde"})
            }
            
        } catch (error) {   
            console.log("WHAT IS ERR: ", error)
            res.status(500).json({error: 'Ha ocurrido un error, Intente más tarde.'})
        }
    })

    // endpoint para borrar comentarios
    app.delete(`${prefix}/:id`, async (req, res) => {
        try {    
            // conexion con db
            let dbFig = await conn();   
            let db = dbFig.db.collection(dbCollection); 
            const { id } = req.params
            
            // borrar comentario de la coleccion de comentarios
            const result = await db.deleteOne({_id: new ObjectId(id)})

            if (result.deletedCount == 1) {
                res.status(204).json({message: 'Se ha borrado con éxito el comentario.'})
            } else {
                res.status(500).json({error: 'No se ha podido borrar el comentario. Se recomienda intentar más tarde'})
            }
        } catch (error) {   
            res.status(500).json({error: 'Ha ocurrido un error, Intente más tarde.'})
        }
    })

    }      