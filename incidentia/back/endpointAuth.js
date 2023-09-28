import ObjectId from 'mongodb';
// const bodyParser = require('body-parser'); // Importa body-parser
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { makeNewToken } from './utils/JWTUtils.js';
import logger from './utils/logger.js';
//const jwt=require("jsonwebtoken")
const dbCollection = "coordinadores";

export function addEndpoints(app, conn) {

    app.use(bodyParser.json());
    // Hacer el login de un usuario
    app.post("/login", async function(request, response){
        const dbFig = await conn();
        const db = dbFig.db.collection(dbCollection);
        const { matricula, password } = request.body;
        try {
            let result = await db.findOne({ matricula: matricula });
            if (result.length == 0) {
                response.sendStatus(401)
            } else {
                bcrypt.compare(password, result.contra, (error, resultB)=>{
                    if(resultB){
                        let token= makeNewToken(result.matricula);
                        response.json({"token": token, "matricula": result.matricula, "nombreC": result.nombreC, "rol": result.rol})
                    }else{
                        response.sendStatus(401)
                    }
                })
            }

        } catch(err) {
            response.sendStatus(401)
        }
    });

    // Hacer el registro de un usuario
    app.post("/registrarse", async function(request, response){
        const dbFig = await conn();
        const db = dbFig.db.collection(dbCollection);

        const { Fname, matricula, password, rol } = request.body;

        // Checks para la generación del nuevo usuario

        // Checar si hay datos
        if (!Fname || !matricula || !password || !rol) {
            response.sendStatus(400, "Faltan datos");
            return;
        }

        // Checar si el usuario tiene mas de 4 caracteres
        if (Fname.length < 4) {
            response.sendStatus(400, "El nombre debe tener al menos 4 caracteres");
            return;
        }

        // Checar si el password tiene mas de 8 caracteres, tiene al menos una mayuscula, un numero y un caracter especial
        if (password.length < 8 || !password.match(/[A-Z]/) || !password.match(/[0-9]/) || !password.match(/[!@#$%^&*.]/)) {
            response.sendStatus(400, "La contraseña debe tener al menos 8 caracteres, una mayúscula, un numero y un carácter especial");
            return;
        }

        try {      
            const result = await db.find({ matricula: matricula }).toArray();
            if (result.length == 0) {
                bcrypt.genSalt(10, (error, salt)=>{
                    bcrypt.hash(password, salt, async(error, hash)=>{
                        let usuarioAgregar={"nombreC": Fname,"matricula": matricula, "contra": hash, "rol": rol};
                        const data = await db.insertOne(usuarioAgregar);
                        // checar si se inserto bien
                        if (data.insertedCount == 0) {
                            response.sendStatus(500, "No se pudo insertar el usuario... Error desconocido");
                            return;
                        }
                        response.sendStatus(200)
                        logger.info("SYS", `Se ha registrado el usuario ${Fname} con matricula ${matricula}`, "endpointAuth.js");
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
                        throw new Error('Credenciales erroneas');
                    }
                })
            }

        } catch(err) {
            response.status(401).json({ message: 'Error al iniciar sesión' });
        }
    });
};