const prefix = "/Usuarios";

export function addEndpoints(app, conn) {
    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    app.get(prefix + "", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection('Usuarios');

            // cosas del endpoint
            // query params
            const { range, filter, sort } = req.query;
        
            // Parse range parameter
            const [start, end] = JSON.parse(range);
            const limit = end - start + 1;
            const skip = start;

            try {
                const query = filter ? JSON.parse(filter) : {};

                // Sorting
                const sortQuery = sort ? JSON.parse(sort) : {};

                const cursor = db.find(query).sort(sortQuery).skip(skip).limit(limit);
                const totalCount = await db.countDocuments(query);

                res.set('Access-Control-Expose-Headers', 'X-Total-Count');
                res.set('X-Total-Count', totalCount);

                const result = await cursor.toArray();
                res.json(result);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                dbConn.close();
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    });

    // getOne 	            GET localhost/Prefix/123
    app.get(prefix + "/:_id", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection('Usuarios');

            // cosas del endpoint
            try {
                const query = {id: parseInt(req.params._id)};

                const result = await db.findOne(query);

                if (!result) {
                    res.status(404).json({ error: 'Resource not found' });
                    return;
                }

                res.json(result);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                dbConn.close();
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    });

    // getMany 	            GET localhost/Prefix?filter={"ids":[123,456,789]}

    
    // getManyReference 	GET localhost/Prefix?filter={"author_id":345}
    // create 	            POST localhost/Prefix
    // update 	            PUT localhost/Prefix/123
    // updateMany 	        Multiple calls to PUT localhost/Prefix/123
    // delete 	            DELETE localhost/Prefix/123
    // deleteMany 	        Multiple calls to DELETE localhost/Prefix/123
};