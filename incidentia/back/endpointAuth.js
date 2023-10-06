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
        try{
            const dbFig = await conn();
            let dbConn = dbFig.conn;
            const db = dbFig.db.collection(dbCollection);
            const { matricula, password } = request.body;
            try {
                // Consulta coordinador
                let result = await db.findOne({ matricula: matricula });
                if (result == null) {
                    return response.status(401).json({message: "Credenciales inválidas. Intente de nuevo"})
                } else {
                    // Validación credencial (passhashed)
                    bcrypt.compare(password, result.contra, (error, resultB)=>{
                        if(resultB){
                            let token= makeNewToken({id: result._id, nombre: result.nombreC}); 
                            const {matricula, nombreCompleto, rol} = result
                            //retorna data de usuario para AAA
                            response.json({token, matricula, nombreCompleto, rol})
                            dbConn.close();
                        }else{
                            // Manda error y cierra conexion con bd
                            dbConn.close();
                            return response.status(401).json({message: "Credenciales inválidas. Intente de nuevo"})
                        }
                    })
                }
    
            } catch(err) {
                // Manda error y cierra conexion con bd
                dbConn.close();
                return response.status(401).json({message: "Credenciales inválidas. Intente de nuevo"})
            }
        }catch(errorConexion){
            // Manda error
            response.status(400).json({error: "Error de conexion"})
        }

    });

    // Hacer el registro de un usuario
    app.post("/registrarse", async function(request, response){
        try{
            const dbFig = await conn();
            let dbConn = dbFig.conn;
            const db = dbFig.db.collection(dbCollection);

            const { nombreCompleto, matricula, password, rol } = request.body;

            console.log(request.body);
    
            // Checks para la generación del nuevo usuario
    
            // Checar si hay datos
            if (!nombreCompleto || !matricula || !password || !rol) {
                response.status(400).json({error: "Todos los campos deben de llenarse."})
                return;
            }
    
            // Checar si el usuario tiene mas de 4 caracteres
            if (matricula.length < 4) {
                return response.status(400).json({error: "La matricula debe tener al menos 4 caracteres"})
                
            }
    
            // Checar si el password tiene mas de 8 caracteres, tiene al menos una mayuscula, un numero y un caracter especial
            if (password.length < 8 || !password.match(/[A-Z]/) || !password.match(/[0-9]/) || !password.match(/[!@#$%^&*.]/)) {
                return response.status(400).json({error: "La contraseña debe tener al menos 8 caracteres, una mayúscula, un numero y un carácter especial"})
            }
            
            try{
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
                            // Checar si se inserto bien o no
                            if (data.insertedCount == 0) {
                                dbConn.close();
                                response.sendStatus(500, "No se pudo insertar el usuario... Error desconocido");
                                return;
                            }
                            response.status(200).json({ message: 'Registro completado' });
                            logger.info("SYS", `Se ha registrado a ${nombreCompleto} con matricula ${matricula}`, "endpointAuth.js");
                            dbConn.close();
                        })
                    })
                } else {
                    // Manda error y cierra conexion con bd
                    dbConn.close();
                    response.status(401).json({ error: 'Ese usuario ya existe.' });
                }
            }catch(errorInsersion){
                // Manda error y cierra conexion con bd
                dbConn.close();
                response.status(401).json({ message: 'Error creando usuario' });
            }
        }catch(errorConexion){
            // Manda error
            response.status(401).json({ message: 'Error de conexion' });
        }
    });

};