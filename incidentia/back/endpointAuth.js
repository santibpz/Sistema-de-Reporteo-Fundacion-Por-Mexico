import ObjectId from 'mongodb';
// const bodyParser = require('body-parser'); // Importa body-parser
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
//const jwt=require("jsonwebtoken")
const prefix = "/Login";
const prefixR = "/registrarse";
const dbCollection = "coordinadores";

export function addEndpoints(app, conn) {

    app.use(bodyParser.json());

    app.post(prefixR, async function(request, response){
        const dbFig = await conn();
        const db = dbFig.db.collection(dbCollection);

        const { matricula, password } = request.body;
        try {      
            console.log(matricula)
            console.log(password)
            const result = await db.find({ nombre: matricula }).toArray();
            if (result.length == 0) {
                bcrypt.genSalt(10, (error, salt)=>{
                    bcrypt.hash(password, salt, async(error, hash)=>{
                        let usuarioAgregar={"nombre": matricula, "contra": hash};
                        const data = await db.insertOne(usuarioAgregar);
                        response.sendStatus(200)
                    })
                })
            } else {
                response.sendStatus(401)
            }

        } catch(err) {
            console.error(err);
            response.sendStatus(500)
        }
    });


    app.post(prefix, async function(request, response){
        const dbFig = await conn();
        const db = dbFig.db.collection(dbCollection);
        const { matricula, password } = request.body;
        try {      
            let result = await db.findOne({ nombre: matricula });
            if (result.length == 0) {
                response.sendStatus(401)
            } else {
                bcrypt.compare(password, result.contra, (error, resultB)=>{
                    console.log(password)
                    if(resultB){
                        let token=jwt.sign({usuario: result.matricula}, "secretKey", {expiresIn: 600});
                        response.json({"token": token, "matricula": matricula})
                    }else{
                        response.sendStatus(401)
                    }
                })
            }

        } catch(err) {
            response.sendStatus(401)
        }
    });
};