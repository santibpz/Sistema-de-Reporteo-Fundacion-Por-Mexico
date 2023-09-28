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

        const { Fname, matricula, password, rol } = request.body;
        try {      
            const result = await db.find({ matricula: matricula }).toArray();
            if (result.length == 0) {
                bcrypt.genSalt(10, (error, salt)=>{
                    bcrypt.hash(password, salt, async(error, hash)=>{
                        let usuarioAgregar={"nombreC": Fname,"matricula": matricula, "contra": hash, "rol": rol};
                        const data = await db.insertOne(usuarioAgregar);
                        response.status(200).json({ message: 'Credenciales guardadas con éxito' });
                    })
                })
            } else {
                console.log("error1")
                throw new Error('Usuario existente');
            }

        } catch(err) {
            console.log("error2")
            response.status(401).json({ message: 'Error creando usuario' });
        }
    });


    app.post(prefix, async function(request, response){
        const dbFig = await conn();
        const db = dbFig.db.collection(dbCollection);
        const { matricula, password } = request.body;
        try {      
            let result = await db.findOne({ matricula: matricula });
            if (result.length == 0) {
                response.status(401).json({ message: 'Usuario inexistente' });
            } else {
                bcrypt.compare(password, result.contra, (error, resultB)=>{
                    if(resultB){
                        let token=jwt.sign({usuario: result.matricula}, "secretKey", {expiresIn: 600});
                        response.json({"token": token, "matricula": result.matricula, "nombreC": result.nombreC, "rol": result.rol})
                    }else{
                        console.log("error1")
                        throw new Error('Credenciales erroneas');
                    }
                })
            }

        } catch(err) {
            console.log("error2")
            response.status(401).json({ message: 'Error al iniciar sesión' });
        }
    });
};