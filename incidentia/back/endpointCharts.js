import { ObjectId } from 'mongodb';
const prefix = "/ChartPage";
const dbCollectionCategorias = "categorias";
const dbCollectionReportes = "reportes";  
const dbCollectionArchivados = "archivados";

export function addEndpoints(app, conn) {   

    app.get(prefix, async (req, res) => {  
        try{
            // conn con db y declaracion de colecciones
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let dbCategorias = dbFig.db.collection(dbCollectionCategorias);
            let dbReportes = dbFig.db.collection(dbCollectionReportes);
            let dbArchivados = dbFig.db.collection(dbCollectionArchivados);
            try{
                //consulta de todas las categorias
                let categorias = await dbCategorias.find({}).toArray();
                // consulta de todos los reportes pendientes
                let reportesPendientes = await dbReportes.find({}).toArray();
                console.log(reportesPendientes)
                // consulta de todos los reportes completados en la colección de archivados
                let reportesCompletados = await dbArchivados.find({}).toArray();

                // obtenciòn de datos en formato {name,pendientes,activos}
                let chartData = await Promise.all(categorias.map(async categoria => {
                    
                 // Filtrar los reportes pendientes por categoría
                let pendientesCount = reportesPendientes.filter(reporte => reporte.categoria.toString() === categoria._id.toString()).length;
                console.log(categoria._id)
                // Filtrar los reportes completados por categoría
                let completadosCount = reportesCompletados.filter(reporte => reporte.categoria.toString() === categoria._id.toString()).length;


                    //consulta y contabilizacion de registros de acuerdo a categoria actual y estatus
                    //let pendientesCount = await dbReportes.countDocuments({categoria: categoria._id, estatus: 'pendiente'})
                    //let completadosCount = await dbReportes.countDocuments({categoria: categoria._id, estatus: 'completado'})

                    //regresa en formato
                    return {
                        name: categoria.nombre,
                        pendientes: pendientesCount,
                        activos: completadosCount //ver con Mau para cambiar a completados en lugar de activos
                    }
                }));

                
                dbConn.close();
                res.json(chartData);
            }catch (error){
                dbConn.close();
                res.status(400);
                res.json("Error de conexion")
            }
        }catch (errorConexion) {
            res.status(400);
            res.json("Error de conexion")
        }
    });
};