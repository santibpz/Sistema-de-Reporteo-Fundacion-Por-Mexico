const prefix = "/ChartPage";
const dbCollectionCategorias = "categorias";
const dbCollectionReportes = "reportes";  

export function addEndpoints(app, conn) {   

    app.get(prefix, async (req, res) => {  
        try{
            // conn con db   
            //let dbFig = await conn();
            //let dbConn = dbFig.conn;
            //let db = dbFig.db.collection(dbCollection);

            

            res.status(200);
            res.json("test2")
        }catch (error) {
            res.status(400);
            res.json("Error consiguiendo datos")
        }//finally {
            //dbConn.close();
        //}
    });
};