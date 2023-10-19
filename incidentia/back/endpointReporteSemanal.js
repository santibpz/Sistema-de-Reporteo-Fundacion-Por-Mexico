import { ObjectId } from 'mongodb';

const prefix = "/dashboard";
// const dbCollection = "reportes";

export function addEndpoints(app, conn) {
    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    // Ejemplo: prefix/reporteSemanal?fechaInicial=18-sep-2023&fechaFinal=22-sep-2023
    app.get(prefix + "", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db   
            let dbFig = await conn();

            let data = []

            // const maxMinReportesPipeline = [
            //     {
            //         $sort: {
            //             numReportesPendientes: 1  // Ordenar en orden descendente según numReportesPendientes
            //         }
            //     },
            //     {$project: {aula: "$nombre", numReportesPendientes:1 }}
            // ]

            // const pipe = [
            //     {
            //         $match: {
            //             tiempoResolucionDias: { $exists: true },  // Asegúrate de que el campo tiempoResolucionDias exista
            //             fechaArchivado: {
            //                 $gte: new Date(new Date().setDate(new Date().getDate() - 7)),  // Fecha hace 7 días
            //                 $lt: new Date()  // Fecha actual
            //             }
            //         }
            //     },
            //     {
            //         $group: {
            //             _id: null,
            //             tiempoPromedio: { $avg: "$tiempoResolucionDias" }
            //         }
            //     }
            // ]

            // const pipe = [
            //     {
            //         $lookup: {
            //             from: "reportes",
            //             localField: "_id",
            //             foreignField: "categoria",
            //             as: "reportes_info"
            //         }
            //     },
            //     {
            //         $addFields: {
            //             cantidad_reportes: { $size: "$reportes_info" }
            //         }
            //     },
            //     {
            //         $project: {
            //             _id: 1, // Puedes incluir o excluir campos según tus necesidades
            //             nombre: 1,
            //             cantidad_reportes: 1
            //         }
            //     }
            // ]
            
    
            const pipe = [
                {  
                    $match: {
                        fecha: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
                    }
                },        
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ]
            
            
            data = await dbFig.db.collection('reportes').aggregate(pipe).toArray()

        
            // res.set('Access-Control-Expose-Headers', 'Content-Range');
            // res.set('Content-Range', data.length);
                                                
            res.json(data);
        
              
        } catch (error) {
            console.error('Error:', error);  
            // next(error); 
        }
    });
};









                // // TODO falta hacer un querry para separar

                // const pipeline = [
                //     // Stage 0: filtrar los reportes de la fecha inicial a la fecha final
                //     {
                //         $match: {
                //             fecha: {
                //                 $gte: new Date(req.query.fechaInicial),
                //                 $lte: new Date(req.query.fechaFinal)
                //             }
                //         }
                //     },
                //     // Stage 1: obtener las referencias a los objetos con valor "ObjectId" de categoria
                //     {
                //         $lookup: {
                //             from: 'categorias',
                //             localField: 'categoria',
                //             foreignField: '_id',
                //             as: 'categoria'
                //         }
                //     },
                //     // Stage 2: obtener las referencias a los objetos con valor "ObjectId" de subcategoria
                //     {
                //         $lookup: {
                //             from: 'subcategorias',
                //             localField: 'subcategoria',
                //             foreignField: '_id',
                //             as: 'subcategoria'
                //         }
                //     },
                //     // Stage 3: proyectar la información que se enviará al cliente (en forma de lista)
                //     {
                //         $project: {
                //             nacional: {
                //                 nuevos: {
                //                     $sum: {
                //                         $cond: [{ $eq: ["$estatus", "nuevo"] }, 1, 0]
                //                     }
                //                 },
                //                 pendientes: {
                //                     $sum: {
                //                         $cond: [{ $eq: ["$estatus", "pendiente"] }, 1, 0]
                //                     }
                //                 },
                //                 completado: {
                //                     $sum: {
                //                         $cond: [{ $eq: ["$estatus", "completado"] }, 1, 0]
                //                     }
                //                 },
                //                 tickets: { $sum: 1 }, // Count all documents
                //                 ticketAbiertoMasTiempo: {
                //                     $max: {
                //                         $subtract: [new Date(), "$fecha"]
                //                     }
                //                 }
                //             },
                //             ejecutivo: {
                //                 nuevos: {
                //                     $sum: {
                //                         $cond: [{ $eq: ["$estatus", "nuevo"] }, 1, 0]
                //                     }
                //                 },
                //                 pendientes: {
                //                     $sum: {
                //                         $cond: [{ $eq: ["$estatus", "pendiente"] }, 1, 0]
                //                     }
                //                 },
                //                 completado: {
                //                     $sum: {
                //                         $cond: [{ $eq: ["$estatus", "completado"] }, 1, 0]
                //                     }
                //                 },
                //                 tickets: { $sum: 1 } // Count all documents
                //             },
                //             coordinador: {
                //                 id: "$_id",
                //                 titulo: 1,
                //                 estatus: 1,
                //                 fecha: 1
                //             }
                //         }
                //     },
                //     // Stage 4: Agrupar todos los resultados en un solo documento
                //     {
                //         $group: {
                //             _id: null,
                //             nacionalNuevos: { $sum: "$nacional.nuevos" },
                //             nacionalPendientes: { $sum: "$nacional.pendientes" },
                //             nacionalCompletado: { $sum: "$nacional.completado" },
                //             nacionalTickets: { $sum: "$nacional.tickets" },
                //             nacionalTicketAbiertoMasTiempo: { $max: "$nacional.ticketAbiertoMasTiempo" },
                //             ejecutivoNuevos: { $sum: "$ejecutivo.nuevos" },
                //             ejecutivoPendientes: { $sum: "$ejecutivo.pendientes" },
                //             ejecutivoCompletado: { $sum: "$ejecutivo.completado" },
                //             ejecutivoTickets: { $sum: "$ejecutivo.tickets" },
                //             coordinador: { $push: "$coordinador" }
                //         }
                //     },
                //     // Step 5: Poner todo en un formato bonito
                //     {
                //         $project: {
                //             _id: 0,
                //             nacional: {
                //                 nuevos: "$nacionalNuevos",
                //                 pendientes: "$nacionalPendientes",
                //                 completado: "$nacionalCompletado",
                //                 tickets: "$nacionalTickets",
                //                 ticketAbiertoMasTiempo: "$nacionalTicketAbiertoMasTiempo"
                //             },
                //             ejecutivo: {
                //                 nuevos: "$ejecutivoNuevos",
                //                 pendientes: "$ejecutivoPendientes",
                //                 completado: "$ejecutivoCompletado",
                //                 tickets: "$ejecutivoTickets"
                //             },
                //             coordinador: "$coordinador"
                //         }
                //     }
                // ];