import ObjectId from 'mongodb';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { makeNewToken } from './utils/JWTUtils.js';
import logger from './utils/logger.js';
const dbCollection = "coordinadores";

export function addEndpoints(app, conn) {

    app.use(bodyParser.json());

    // Hacer el login de un usuario
    app.post("/login", async function(request, response){
        const dbFig = await conn();
        const db = dbFig.db.collection(dbCollection);
        const { matricula, password } = request.body;
        logger.info("test1")
        try {
            // Consulta coordinador
            let result = await db.findOne({ matricula: matricula });
            if (result.length == 0) {
                response.sendStatus(401)
            } else {
                // Validación credencial (passhashed)
                
                bcrypt.compare(password, result.contra, (error, resultB)=>{
                    if(resultB){
                        let token= makeNewToken(result.matricula);
                        //retorna data de usuario para AAA
                        response.json({"token": token, "matricula": result.matricula, "nombreCompleto": result.nombreCompleto, "rol": result.rol, "message": "Credenciales verificadas"})
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

        const { nombreCompleto, matricula, password, rol } = request.body;

        // Checks para la generación del nuevo usuario

        // Checar si hay datos
        if (!nombreCompleto || !matricula || !password || !rol) {
            response.sendStatus(400, "Faltan datos");
            return;
        }

        // Checar si el usuario tiene mas de 4 caracteres
        if (matricula.length < 4) {
            response.sendStatus(400, "El nombre debe tener al menos 4 caracteres");
            return;
        }

        // Checar si el password tiene mas de 8 caracteres, tiene al menos una mayuscula, un numero y un caracter especial
        if (password.length < 8 || !password.match(/[A-Z]/) || !password.match(/[0-9]/) || !password.match(/[!@#$%^&*.]/)) {
            response.sendStatus(400, "La contraseña debe tener al menos 8 caracteres, una mayúscula, un numero y un carácter especial");
            return;
        }

        try {      
            // Validación usuario nuevo
            const result = await db.find({ matricula: matricula }).toArray();
            if (result.length == 0) {
                // Generación de sal
                bcrypt.genSalt(10, (error, salt)=>{
                    // Generación de credencial (passhashed)
                    bcrypt.hash(password, salt, async(error, hash)=>{
                        let usuarioAgregar={"nombreCompleto": nombreCompleto,"matricula": matricula, "contra": hash, "rol": rol};
                        // Insersión de datos
                        const data = await db.insertOne(usuarioAgregar);
                        // Checar si se inserto bien
                        if (data.insertedCount == 0) {
                            response.sendStatus(500, "No se pudo insertar el usuario... Error desconocido");
                            return;
                        }
                        response.status(200).json({ message: 'Registro completado' });
                        logger.info("SYS", `Se ha registrado a ${nombreCompleto} con matricula ${matricula}`, "endpointAuth.js");
                    })
                })
            } else {
                throw new Error('Usuario existente');
            }

        } catch(err) {
            response.status(401).json({ message: 'Error creando usuario' });
        }
    });

};