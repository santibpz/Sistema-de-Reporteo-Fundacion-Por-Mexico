import ObjectId from 'mongodb';

const prefix = "/Incidencia";
const dbCollection = "Incidencia";

export function addEndpoints(app, conn) {
    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    app.get(prefix + "", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);

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
            next(error); 
        }
    });

    // getOne 	            GET localhost/Prefix/123
    app.get(prefix + "/:_id", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);

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

    
    // create 	            POST localhost/Prefix
    app.post(prefix + "", async (req, res, next) => {
        try {
            const dbFig = await conn();
            const dbConn = dbFig.conn;
            const db = dbFig.db.collection(dbCollection);
    
            try {
                // Validate and sanitize req.body here
                delete req.body._id;
                delete req.body.id;
        
                const result = await db.insertOne(req.body);
                dbConn.close();
        
                if (result.insertedId) {
                    res.status(201).json({ID: result.insertedId}); // 201 Created
                } else {
                    res.status(500).json({ error: 'Failed to create the resource' });
                }
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                dbFig.close();
            }
        } catch (error) {
            console.error('Error:', error);
            next(error); // Pass the error to the error handling middleware
        }
    });

    // update 	            PUT localhost/Prefix/123
    app.put(prefix + "/:_id", async (req, res) => {
        try {
            const dbFig = await conn();
            const db = dbFig.db.collection(dbCollection);
    
            // Validate the _id parameter
    
            // Validate and sanitize req.body here
    
            try {
                const result = await db.findOneAndUpdate(
                    { _id: new ObjectId.ObjectId(req.params._id) }, // Use _id for MongoDB document lookup
                    { $set: req.body }
                );
    
                if (result) {
                    res.json(result);
                } else {
                    res.status(404).json({ error: 'Resource not found' });
                }
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                dbFig.close();
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // delete 	            DELETE localhost/Prefix/123
    app.delete(prefix + "/:_id", async (req, res) => {
        // cosas de todos los endpoints
        try {
            // conn con db
            let dbFig = await conn();
            let dbConn = dbFig.conn;
            let db = dbFig.db.collection(dbCollection);

            // cosas del endpoint
            try {
                const result = await db.deleteOne({_id: new ObjectId.ObjectId(req.params._id)});

                res.json(result.deletedCount);
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

};