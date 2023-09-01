const prefix = "/Usuarios";

export function addEndpoints(app, conn) {
    // getList:    (resource, params) => Promise, // get a list of records based on sort, filter, and pagination

    app.get(prefix + "", async (req, res) => {
        // cosas de todos los endpoints
        let db = await conn();

        // cosas del endpoint
        let collection = await db.collection('Usuarios').find().toArray();
        res.set("Access-Control-Expose-Headers", "X-Total-Count");
        res.set("X-Total-Count", collection.length);
        res.json(collection);

        // Cosas de todos los endpoints
        db.close();
    });

    // getList 	            GET localhost/Prefix?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
    // getOne 	            GET localhost/Prefix/123
    // getMany 	            GET localhost/Prefix?filter={"ids":[123,456,789]}
    // getManyReference 	GET localhost/Prefix?filter={"author_id":345}
    // create 	            POST localhost/Prefix
    // update 	            PUT localhost/Prefix/123
    // updateMany 	        Multiple calls to PUT localhost/Prefix/123
    // delete 	            DELETE localhost/Prefix/123
    // deleteMany 	        Multiple calls to DELETE localhost/Prefix/123
};