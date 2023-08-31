const express=require('express');
const mongoCLient=require('mongodb').MongoClient;

let db;
const app=express();

async function connDB(){
    let client = new mongoCLient('mongodb://mongoadmin:bdung@localhost:27017/?authSource=admin&readPreference=primary&ssl=false&directConnection=true');
    await client.connect();
    
    // if (!client.isConnected) {
    //     console.log('Error connecting to DB');
    //     return;
    // }

    db = client.db('Incidentia');
    console.log('Connected to DB');
}

app.get('/', async (req, res) => {
    let collection = await db.collection('Usuarios').find().toArray();
    res.json(collection);
});

app.listen(8081, async () => {
    await connDB();
    console.log('Server is running on port 8081')
});
