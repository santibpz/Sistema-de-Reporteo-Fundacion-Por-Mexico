import { ObjectId } from 'mongodb';

const prefix = "/reporteSemanal";
const dbCollection = "reportes";

export function addEndpoints(app, conn) {
    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    // Ejemplo: prefix/reporteSemanal?fechaInicial=18-sep-2023&fechaFinal=22-sep-2023
    app.get(prefix + "", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db   
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);


            try {
                // TODO falta hacer un querry para separar

                const pipeline = [
                    // Stage 0: filtrar los reportes de la fecha inicial a la fecha final
                    {
                        $match: {
                            fecha: {
                                $gte: new Date(req.query.fechaInicial),
                                $lte: new Date(req.query.fechaFinal)
                            }
                        }
                    },
                    // Stage 1: obtener las referencias a los objetos con valor "ObjectId" de categoria
                    {
                        $lookup: {
                            from: 'categorias',
                            localField: 'categoria',
                            foreignField: '_id',
                            as: 'categoria'
                        }
                    },
                    // Stage 2: obtener las referencias a los objetos con valor "ObjectId" de subcategoria
                    {
                        $lookup: {
                            from: 'subcategorias',
                            localField: 'subcategoria',
                            foreignField: '_id',
                            as: 'subcategoria'
                        }
                    },
                    // Stage 3: proyectar la información que se enviará al cliente (en forma de lista)
                    {
                        $project: {
                            nacional: {
                                nuevos: {
                                    $sum: {
                                        $cond: [{ $eq: ["$estatus", "nuevo"] }, 1, 0]
                                    }
                                },
                                pendientes: {
                                    $sum: {
                                        $cond: [{ $eq: ["$estatus", "pendiente"] }, 1, 0]
                                    }
                                },
                                completado: {
                                    $sum: {
                                        $cond: [{ $eq: ["$estatus", "completado"] }, 1, 0]
                                    }
                                },
                                tickets: { $sum: 1 }, // Count all documents
                                ticketAbiertoMasTiempo: {
                                    $max: {
                                        $subtract: [new Date(), "$fecha"]
                                    }
                                }
                            },
                            ejecutivo: {
                                nuevos: {
                                    $sum: {
                                        $cond: [{ $eq: ["$estatus", "nuevo"] }, 1, 0]
                                    }
                                },
                                pendientes: {
                                    $sum: {
                                        $cond: [{ $eq: ["$estatus", "pendiente"] }, 1, 0]
                                    }
                                },
                                completado: {
                                    $sum: {
                                        $cond: [{ $eq: ["$estatus", "completado"] }, 1, 0]
                                    }
                                },
                                tickets: { $sum: 1 } // Count all documents
                            },
                            coordinador: {
                                id: "$_id",
                                titulo: 1,
                                estatus: 1,
                                fecha: 1
                            }
                        }
                    },
                    // Stage 4: Agrupar todos los resultados en un solo documento
                    {
                        $group: {
                            _id: null,
                            nacionalNuevos: { $sum: "$nacional.nuevos" },
                            nacionalPendientes: { $sum: "$nacional.pendientes" },
                            nacionalCompletado: { $sum: "$nacional.completado" },
                            nacionalTickets: { $sum: "$nacional.tickets" },
                            nacionalTicketAbiertoMasTiempo: { $max: "$nacional.ticketAbiertoMasTiempo" },
                            ejecutivoNuevos: { $sum: "$ejecutivo.nuevos" },
                            ejecutivoPendientes: { $sum: "$ejecutivo.pendientes" },
                            ejecutivoCompletado: { $sum: "$ejecutivo.completado" },
                            ejecutivoTickets: { $sum: "$ejecutivo.tickets" },
                            coordinador: { $push: "$coordinador" }
                        }
                    },
                    // Step 5: Poner todo en un formato bonito
                    {
                        $project: {
                            _id: 0,
                            nacional: {
                                nuevos: "$nacionalNuevos",
                                pendientes: "$nacionalPendientes",
                                completado: "$nacionalCompletado",
                                tickets: "$nacionalTickets",
                                ticketAbiertoMasTiempo: "$nacionalTicketAbiertoMasTiempo"
                            },
                            ejecutivo: {
                                nuevos: "$ejecutivoNuevos",
                                pendientes: "$ejecutivoPendientes",
                                completado: "$ejecutivoCompletado",
                                tickets: "$ejecutivoTickets"
                            },
                            coordinador: "$coordinador"
                        }
                    }
                ];

                const queryCursor = await db.aggregate(pipeline);

                // Convert the result of the query to a single document or an array
                let data = await queryCursor.toArray();

                if (data.length === 1) {
                    data = data[0];
                }

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
            next(error); 
        }
    });
};