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

      // Parse range parameter
      const [start, end] = JSON.parse(range);
      const limit = end - start + 1;
      const skip = start;

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
        const [field, order] = sort;
        const sortQuery = { [field]: order === "ASC" ? 1 : -1 };
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
        const user = await dbFig.db
          .collection("coordinadores")
          .findOne({ _id: new ObjectId(decodedToken.id) });

        if (!user)
          return res
            .status(401)
            .json({ error: "Ocurrió un error. Favor de iniciar Sesión" });

        // mostrar solo los reportes creados por el coordinador de aula
        if (user.rol == "Aula") {
          // Agregar el filtro de usuario al query de filtros
          filterQuery.coordinador = new ObjectId(decodedToken.id);
        } 

        const getReportesPipeline = [
          { $match: filterQuery }, // inicia con el filtro
          ...mainPipeline, // construye todas sus madres
          { $sort: sortQuery }, // hace un sort de la info
          { $skip: skip }, // consigue solo pa partir de cierto numero
          { $limit: limit }, // consigue hasta cierto otro numero
        ];

        let data = [];
        data = await db.aggregate(getReportesPipeline).toArray();

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
        console.log(req.params.id);

        const pipeline = findOnePipeline(new ObjectId(req.params.id));

        const queryCursor = await db.aggregate(pipeline);
        let data = await queryCursor.toArray();

        data.length > 1
          ? res
              .status(404)
              .json({
                error: "Hubo un problema con la visualización del reporte",
              })
          : res.json(data[0]);
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

        const reporte = {
          ...data,
          coordinador: new ObjectId(decodedToken.id),
          categoria: new ObjectId(data.categoria),
          subcategoria: new ObjectId(data.subcategoria),
          estatus: "pendiente",
          fecha: new Date()
        };
        const result = await db.insertOne(reporte);

        if (result.insertedId) {
          res.status(201).json({ id: result.insertedId }); // 201 Created
        } else {
          res
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

      // extraemos el id del reporte a borrar 
      const { id } = req.params

        // borrar reporte
        const result = await db.deleteOne({_id: new ObjectId(id)})

        // borrar comentarios asociados al reporte

        const deleteCommentsQuery = await dbFig.db.collection('comentarios').deleteMany({reporte: new ObjectId(id)})

        if (result.deletedCount == 1 && deleteCommentsQuery.acknowledged == true) {
            res.status(204).json({id})
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
