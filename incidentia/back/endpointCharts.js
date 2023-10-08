import { ObjectId } from 'mongodb';
const prefix = "/ChartPage";
const dbCollectionCategorias = "categorias";
const dbCollectionReportes = "reportes";  

export function addEndpoints(app, conn) {   

    app.get(prefix, async (req, res) => {  
        try{
            // conn con db y declaracion de colecciones
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let dbCategorias = dbFig.db.collection(dbCollectionCategorias);
            let dbReportes = dbFig.db.collection(dbCollectionReportes);
            try{
                //consulta de todas las categorias
                let categorias = await dbCategorias.find({}).toArray();

                // obtenciòn de datos en formato {name,pendientes,activos}
                let chartData = await Promise.all(categorias.map(async categoria => {
                    //consulta y contabilizacion de registros de acuerdo a categoria actual y estatus
                    let pendientesCount = await dbReportes.countDocuments({categoria: categoria._id, estatus: 'pendiente'})
                    let completadosCount = await dbReportes.countDocuments({categoria: categoria._id, estatus: 'completado'})

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