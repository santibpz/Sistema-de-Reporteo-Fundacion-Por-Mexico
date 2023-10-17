import { ObjectId } from 'mongodb';
import { calculaDiasTranscurridos } from './utils/calculaTiempo.js';
import { mainPipeline } from './utils/pipelines.js';

const prefix = "/archivados";
const dbCollection = "archivados";

export function addEndpoints(app, conn) {

    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
  app.get(prefix + "", async (req, res) => {
    // cosas de todos los endpoints
    try {
      // conn con db
      let dbFig = await conn();
      let dbConn = dbFig.conn;
      let db = dbFig.db.collection(dbCollection);

      // cosas de filtros
      // query params
      const { range, filter, sort } = req.query;

      // Parse range parameter
      const [start, end] = JSON.parse(range);
      const limit = end - start + 1;
      const skip = start;

      try {
          // Filtering
          const query = filter ? JSON.parse(filter) : {};
          if (query.categoria){ 
            query.categoria = new ObjectId(query.categoria) // si hay un filtro de categoria, lo convierte a ObjectId
        }
        if (query.titulo) { 
            query.titulo = { $regex: query.titulo, $options: 'i' }; // Búsqueda difusa (ignorando mayúsculas/minúsculas)
        }
        // Sorting
        const [field, order] = sort;
        const sortQuery = { [field]: order === "ASC" ? 1 : -1 };
        // convierte de [cosa, otro] a {cosa: otro}

         // El pipeline a la base de datos que obtiene la información a enviar al cliente

        const getReportesArchivadosPipeline = [
          { $match: query }, // inicia con el filtro
          ...mainPipeline, // construye todas sus madres
          { $sort: sortQuery }, // hace un sort de la info
          { $skip: skip }, // consigue solo pa partir de cierto numero
          { $limit: limit }, // consigue hasta cierto otro numero
        ];

        const data = await db.aggregate(getReportesArchivadosPipeline).toArray();
        
        // Pipeline secundario para obtener la cuenta total de elementos (después de filtrar)
        const totalCountPipeline = [
          { $match: query }, // filtra
          { $count: 'totalCount' } // cuenta
      ];
        let [totalCount] = await db.aggregate(totalCountPipeline).toArray();

        if (!totalCount) {
            totalCount = { totalCount: 0 };
        }

        // Agrega los headers de react-admin para que sepa cuantos hay de cuantos y en donde esta
        res.set("Access-Control-Expose-Headers", "Content-Range");
        res.set(
          "Content-Range",
          `items ${skip + 1}-${skip + data.length}/${totalCount.totalCount}`
        );

        res.status(200).json(data);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Ocurrió un error" });
      } finally {
        dbConn.close();
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Ocurrió un error" });
    }
  });

    // creacion de un reporte archivado
    app.post(prefix, async (req, res) => {
        try {
            // conexion con db    
            let dbFig = await conn();    
            let db = dbFig.db.collection(dbCollection);   
            
            // extraemos el id del reporte a archivar y la información de la actualización del reporte
            const {reporteId, estatus, resolucion, razon } = req.body

            // buscamos el reporte en la base de datos a través de su id
            const reporte = await dbFig.db.collection('reportes').findOne({_id: new ObjectId(reporteId)})

            // validar si se encontró un resultado
            if(reporte == null) return res.status(500).json({error: 'Ha ocurrido un error. Por favor intente más tarde.'})

            // obtenemos la fecha actual
            const fecha = new Date()

            // calculamos los días transcurridos desde que se levantó el reporte hasta que se marca como completado
            const diasTranscurridos = calculaDiasTranscurridos(reporte.fecha, fecha)

            // pipeline del número de intermediarios
            const intermediariosPipeline = [
                // stage 1: hacer match de todos los seguimientos/comentarios asociados al id de reporte a archivar
                {$match: {reporte: new ObjectId(reporteId)}},
                // stage 2: hacemos un inner join para obtener la información de los usuarios intermediarios en base a su id
                {$lookup: {
                    from: 'coordinadores',
                    localField: 'publicadoPor',
                    foreignField: '_id',
                    as: 'intermediario'
                }},
                // stage 3: deconstruimos el arreglo intermediarios
                {$unwind: "$intermediario"},
                // stage 4: hacemos una proyección de los campos de interes
                {$project: {_id: 0, nombreIntermediario: "$intermediario.nombreCompleto", rol: "$intermediario.rol", comentario:1, fecha:1}}
            ]

            // obtenemos los intermediarios de la base de datos
            const intermediarios = await dbFig.db.collection('comentarios').aggregate(intermediariosPipeline).toArray()

            // construimos el objeto del reporte archivado a almacenar en la base de datos
            const reporteArchivado = {
                ...reporte,
                _id: new ObjectId(),
                fecha,
                estatus,
                resolucion,
                razon,
                intermediarios,
                tiempoResolucion: diasTranscurridos == 1 ? `${diasTranscurridos} día` : `${diasTranscurridos} días`
            }

                console.log("this reporte a archivar", reporteArchivado)
                
            // insertamos el reporte archivado a la base de datos 
            const result = await db.insertOne(reporteArchivado)

            console.log(result)

            if(result.insertedId) { // verificamos que el archivo se haya archivado correctamente

                // borramos el reporte de la coleccion de reporte
                await dbFig.db.collection('reportes').deleteOne({_id: new ObjectId(reporteId)})
                res.status(201).json({id: result.insertedId})
            } else {
                res.status(500).json({error: "No se pudo archivar el reporte. Intente más tarde."})
            }

        }   
        catch (error) {   
            res.status(500).json({ error: 'Ocurrió un error. Intente más tarde' });
        } 
    })
    
}