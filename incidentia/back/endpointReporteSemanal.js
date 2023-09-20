import { ObjectId } from 'mongodb';

const prefix = "/reporteSemanal";
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

                const pipeline = [
                    // stage 0: filtrar los reportes de la fecha inicial a la fecha final
                    {
                        $match: {
                            fecha: {
                                $gte: new Date(req.query.fechaInicial),
                                $lte: new Date(req.query.fechaFinal)
                            }
                        }
                    },
                    // stage 1: obtener las referencias a los objetos con valor "ObjectId" de categoria
                    {
                        $lookup: {
                            from: 'categorias',
                            localField: 'categoria',
                            foreignField: '_id',
                            as: 'categoria'
                        }
                    },
                    // stage 2: obtener las referencias a los objetos con valor "ObjectId" de subcategoria
                    {
                        $lookup: {
                            from: 'subcategorias',
                            localField: 'subcategoria',
                            foreignField: '_id',
                            as: 'subcategoria'
                        }
                    },
                    // stage 3: proyectar la información que se enviará al cliente
                    {
                        $project: {
                            nacional: { // TODO falta separalo por aula
                                nuevos: $count({ $eq: ["$estatus", "nuevo"] }),
                                pendientes: $count({ $eq: ["$estatus", "pendiente"] }),
                                completado: $count({ $eq: ["$estatus", "completado"] }),
                                tickets: $count(),
                                ticketAbiertoMasTiempo: $max({ $subtract: [new Date(), "$fecha"] })
                            },
                            ejecutivo: { // TODO falta separalo por aula
                                nuevos: $count({ $eq: ["$estatus", "nuevo"] }),
                                pendientes: $count({ $eq: ["$estatus", "pendiente"] }),
                                completado: $count({ $eq: ["$estatus", "completado"] }),
                                tickets: $count()
                            },
                            coordinador: { // TODO falta separalo por aula
                                id: "$_id",
                                titulo: 1,
                                estatus: 1,
                                fecha: 1
                            }
                        }
                    }
                ]

                // el query a la base de datos que obtiene la informacion a enviar al cliente
                const queryCursor = await db.aggregate(pipeline)

                // convertimos el resultado del query a un arreglo con todos los objetos que representan cada reporte
                let data = await queryCursor.toArray()

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
    });
};