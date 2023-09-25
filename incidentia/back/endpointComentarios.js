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
                const {id:reporteId, comentario} = req.body

                const comentarioInfo = {
                    comentario,
                    fecha: newDate()
                }

                // creamos el comentario en la colección comentarios
                const result = await db.insertOne({comentario: comentarioInfo})
        
                if(result.insertedId) {
                    const { insertedId } = result

                    // agregar el id de comentario creado al arreglo de comentarios del reporte
                    const insertQuery = await dbFig.db.collection('reportes').updateOne({_id: new ObjectId(reporteId)}, {$push: {comentarios: insertedId}})

                    if(insertQuery.modifiedCount == 1) {
                        res.status(201).json({id: result.insertedId}); // 201 Created
                    } else {
                        // borrar el comentario si no se pudo añadir en el arreglo de comentarios y mandar el error
                        await db.deleteOne({_id: new ObjectId(insertedId)})
                        res.status(500).json({error: "no se ha podido agregar la actualización del reporte. Intente más tarde."})
                    }

                } else {
                    res.status(500).json({error: "No se pudo crear el comentario. Intente más tarde."})
                }

              
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Ocurrió un error. Intente más tarde' });
            } finally {
                dbConn.close();       
            }   
        } catch (error) {   
            console.error('Error:', error);
        }
    })
    
    
    )}      