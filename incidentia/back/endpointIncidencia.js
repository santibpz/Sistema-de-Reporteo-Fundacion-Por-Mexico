import { ObjectId } from "mongodb";
import { mainPipeline, findOnePipeline } from "./utils/pipelines.js";
import { verifyTokenFromReq } from "./utils/JWTUtils.js";

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

      // cosas de filtros
      // query params
      const { range, filter, sort } = req.query;

      console.log(req.query)

      // Parse range parameter
      let limit, skip;
      if(range) {
        const [start, end] = JSON.parse(range);
        limit = end - start + 1;
        skip = start;
      }

      try {

        // Filtering
        const filterQuery = filter ? JSON.parse(filter) : {};
        
        if (filterQuery.categoria){ 
            filterQuery.categoria = new ObjectId(filterQuery.categoria) // si hay un filtro de categoria, lo convierte a ObjectId
        }
        if (filterQuery.titulo) { 
            filterQuery.titulo = { $regex: filterQuery.titulo, $options: 'i' }; // Búsqueda difusa (ignorando mayúsculas/minúsculas)
        }

        // Sorting
        let sortQuery;
        if(sort) {
          const [field, order] = sort;
          sortQuery = { [field]: order === "ASC" ? 1 : -1 };

        }
        // convierte de [cosa, otro] a {cosa: otro}

        // extraemos el token de la solicitud
        const decodedToken = verifyTokenFromReq(req);

        // si el objeto decodedToken no tiene un campo id, el token no ha podido ser verificado porque expiró y se necesita volver a iniciar sesión
        if (!decodedToken.id)
          return res
            .status(401)
            .json({
              error:
                "Su sesión ha expirado, por favor inicie sesión nuevamente.",
            });

        // verificamos los permisos del coordinador
        const coordinador = await dbFig.db
          .collection("coordinadores")
          .findOne({ _id: new ObjectId(decodedToken.id) });

        if (!coordinador)
          return res
            .status(401)
            .json({ error: "Ocurrió un error. Favor de iniciar Sesión" });

        // mostrar solo los reportes creados por el coordinador de aula
        if (coordinador.rol == "Aula") {
          // Agregar a query que solo sean los tickets del usuario
          filterQuery.coordinador = new ObjectId(decodedToken.id);
        } else if(coordinador.rol == "Nacional" || coordinador.rol == "Ejecutivo") {
          // id del aula de la cual se buscan los reportes
          if(filterQuery.aula) { // si tiene un filtro de aula, convertir en ID de mongo
            console.log(filterQuery.aula);
            filterQuery.aula = new ObjectId(filterQuery.aula);
          } 
        }

        
        let getReportesPipeline = [
          { $match: filterQuery }, // inicia con el filtro
          ...mainPipeline, // construye todas sus madres
          { $sort: sortQuery }, // hace un sort de la info
          { $skip: skip }, // consigue solo pa partir de cierto numero
          { $limit: limit }, // consigue hasta cierto otro numero
        ];

        let data = await db.aggregate(getReportesPipeline).toArray();

        console.log('aa', data)

        // Pipeline secundario para obtener la cuenta total de elementos (después de filtrar)
        const totalCountPipeline = [
          { $match: filterQuery }, // filtra
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

  // getOne 	            GET localhost/Prefix/123
  app.get(prefix + "/:id", async (req, res, next) => {
    // cosas de todos los endpoints
    try {
      // conn con db
      let dbFig = await conn();
      let dbConn = dbFig.conn;
      let db = dbFig.db.collection(dbCollection);

      // cosas del endpoint
      try {

        //  // verificar que solo oordinador ejecutivo pueda acceder a este recurso
         const decodedToken = verifyTokenFromReq(req);

        //  // si el objeto decodedToken no tiene un campo id, el token no ha podido ser verificado porque expiró y se necesita volver a iniciar sesión
         if (!decodedToken.id)
         return res
         .status(401)
         .json({
             error:
             "Su sesión ha expirado, por favor inicie sesión nuevamente.",
         });

        //  // verificamos si el usuario accediendo a este recurso el la persona que creó el reporte
         const coordinador = await dbFig.db.collection('coordinadores').findOne({_id: new ObjectId(decodedToken.id)})
         if(coordinador == null ) return res.status(403).json({error: "Este recurso no existe"})

        //  // verificar si el reporte lo creo el usuario que solicita
         const reporte = await dbFig.db.collection('reportes').findOne({_id: new ObjectId(req.params.id)})

        // si el id del coordinador no es el mismo que el id del creador del reporte, entonces, no se podrá visualizar el reporte
         if(reporte.coordinador != decodedToken.id) {
          return res.status(403).json({error: "Este recurso no existe"})

         } 
        // creamos el pipeline para encontrar el reporte
        const pipeline = findOnePipeline(new ObjectId(req.params.id));

        const queryCursor = await db.aggregate(pipeline);
        let data = await queryCursor.toArray();

        if(data.length > 1)
         { 
          return res
              .status(404)
              .json({
                error: "Hubo un problema con la visualización del reporte",
              })
        } else {
          return res.json(data[0]);

        }
      } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
      } finally {
        dbConn.close();
      }
    } catch (error) {
      console.log("Error:", error);
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
      const db = dbFig.db.collection(dbCollection);
     
        // información del reporte
        const data = req.body;

        // extraemos el token de la solicitud
        const decodedToken = verifyTokenFromReq(req);

        // si el objeto decodedToken no tiene un campo id, el token no ha podido ser verificado porque expiró y se necesita volver a iniciar sesión
        if (!decodedToken.id)
          return res
            .status(401)
            .json({
              error:
                "Su sesión ha expirado, por favor inicie sesión nuevamente.",
            });

        // obtenemos la informacion del coordinador para poder asignar al reporte el id del aula al que el reporte esta asociado
        const coordinador = await dbFig.db.collection('coordinadores').findOne({_id: new ObjectId(decodedToken.id)})
        if(coordinador.rol != 'Aula') return res.status(401).json({error: 'El recurso no está disponible'})

        const reporte = {
          ...data,
          coordinador: new ObjectId(decodedToken.id),
          aula: new ObjectId(coordinador.aula),
          categoria: new ObjectId(data.categoria),
          subcategoria: new ObjectId(data.subcategoria),
          estatus: "pendiente",
          fecha: new Date()
        };
        const result = await db.insertOne(reporte);

        if (result.insertedId) {
          // agregamos a la cuenta de numero de reportes pendientes en la coleccion aulas
          const queryAula = await dbFig.db.collection('aulas').updateOne({ _id: new ObjectId(coordinador.aula) }, { $inc: { numReportesPendientes: 1 } })
          console.log("this queri aula", queryAula)
          if(queryAula.modifiedCount == 1)  {
           return res.status(201).json({ id: result.insertedId })  // 201 Created
          } else {
            await db.deleteOne({_id: new ObjectId(result.insertedId)}) // si no se pudo actualizar el contador de reportes activos en la coleccion de aulas, entonces borramos el reporte creado para no causar irregularidades en la base de datos
            return res.status(500).json({error: 'Lo sentimos, ocurrió un problema creando el reporte'})
          }
           
        } else {
          return res
            .status(500)
            .json({ error: "No se pudo crear el reporte. Intente más tarde" });
        }
      } catch (error) {
        next(error)
      } 
  });

  // update 	            PUT localhost/Prefix/123
  app.put(prefix + "/:id", async (req, res) => {
    try {
      // conexión con la base de datos
      const dbFig = await conn();
      const dbConn = dbFig.conn; // client
      const db = dbFig.db.collection(dbCollection);

      // obtener la informacion del cuerpo de la solicitud
      const { estatus } = req.body;
      const result = await db.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { estatus } }
      );
      console.log(result);

      result.modifiedCount === 1
        ? res.status(200).json({ id: req.params.id })
        : res
            .status(500)
            .json({
              error:
                "Ocurrió un problema al modificar el estatus de. Reporte. Intentar más tarde",
            });

      dbConn.close();
    } catch (error) {
      console.error("Errorr:", error);
      res
        .status(500)
        .json({ error: "Ocurrió un problema. Intentar más tarde" });
    }
  });

  // delete 	            DELETE localhost/Prefix/123
  app.delete(prefix + "/:id", async (req, res) => {
    // cosas de todos los endpoints
    try {
      // conn con db
      let dbFig = await conn();
      let db = dbFig.db.collection(dbCollection);

       // verificar que solo oordinador ejecutivo pueda acceder a este recurso
       const decodedToken = verifyTokenFromReq(req);

       // si el objeto decodedToken no tiene un campo id, el token no ha podido ser verificado porque expiró y se necesita volver a iniciar sesión
       if (!decodedToken.id)
       return res
       .status(401)
       .json({
           error:
           "Su sesión ha expirado, por favor inicie sesión nuevamente.",
       });

       // verificamos si el usuario accediendo es ejecutivo
       const coordinador = await dbFig.db.collection('coordinadores').findOne({_id: new ObjectId(decodedToken.id)})
       if(coordinador == null) return res.status(403).json({error: "No tienes permiso de para realizar esta acción."})

      // extraemos el id del reporte a borrar 
      const { id } = req.params

      console.log('QQ')

        // borrar reporte
        const result = await db.deleteOne({_id: new ObjectId(id)})

        console.log(result)

        if (result.deletedCount == 1) {
          console.log('herter')
          // borrar comentarios asociados al reporte
          await dbFig.db.collection('comentarios').deleteMany({reporte: new ObjectId(id)})

          // hacemos update del numero de reportes pendientes en la coleccion de aulas
          const queryAula = await dbFig.db.collection('aulas').updateOne({ _id: new ObjectId(coordinador.aula) }, { $inc: { numReportesPendientes: -1 } })
          console.log('qA',queryAula)
          if(queryAula.modifiedCount == 1) return res.status(204).json({id})
        } else {
            res.status(500).json({error: 'No se ha podido borrar el reporte. Se recomienda intentar más tarde'})
        }
      }
   catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  });
}
