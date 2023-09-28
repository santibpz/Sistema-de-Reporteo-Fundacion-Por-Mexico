// endpoints para comentarios
import { ObjectId } from 'mongodb';
const prefix = "/comentarios";
const dbCollection = "comentarios";

export function addEndpoints(app, conn) {
    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    app.get(prefix + "", async (req, res) => {
        try {    
            // conexion con db
            let dbFig = await conn();   
            let dbConn = dbFig.conn; // cliente
            let db = dbFig.db.collection(dbCollection);

            try {
               
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
    },


    // post comments
    app.post(prefix, async (req, res) => {
        try {
            // conexion con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);
            try {

                // recibimos el id del reporte al que se le agrega el comentario y el contenido del comentario
                const {reporteId, comentario} = req.body

                // checar que el id del reporte al que se añadirá comentario sea valido
                if(new ObjectId(reporteId)) {

                    // información del comentario
                    const comentarioData = {
                        comentario,
                        reporte: new ObjectId(reporteId),
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
                console.error('Error:', error);
                res.status(500).json({ error: 'Ocurrió un error creando el comentario. Intente más tarde' });
            } finally {
                dbConn.close();       
            }

        } catch (error) {   
            console.error('Error:', error);
            res.status(500).json({ error: 'Ocurrió un error. Intente más tarde' });

        } 
    }),

    // endpoint para borrar comentarios
    app.delete(`${prefix}/:id`, async (req, res) => {
        try {    
            // conexion con db
            let dbFig = await conn();   
            let dbConn = dbFig.conn; // cliente
            let db = dbFig.db.collection(dbCollection); 
            const { id } = req.params
            
            // borrar comentario de la coleccion de comentarios
            const result = await db.deleteOne({_id: new ObjectId(id)})

            if (result.deletedCount == 1) {
                res.status(204).json({message: 'deleted'})
            } else {
                res.status(500).json({error: 'No se ha podido crear un comentario. Se recomienda intentar más tarde'})
            }
        } catch (error) {   
            res.status(500).json({error: 'Ha ocurrido un error, Intente más tarde.'})
        }
    })

    )}      