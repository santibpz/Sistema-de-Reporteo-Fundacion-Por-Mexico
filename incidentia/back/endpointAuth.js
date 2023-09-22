import ObjectId from 'mongodb';
// const bodyParser = require('body-parser'); // Importa body-parser
import bodyParser from 'body-parser';
const prefix = "/Login";
const dbCollection = "coordinadores";

export function addEndpoints(app, conn) {

    app.use(bodyParser.json()); // Usa body-parser para analizar JSON en las solicitudes
// ... (resto de tu código)

    app.post(prefix, async function(request, response){
        const dbFig = await conn();
        const db = dbFig.db.collection(dbCollection);

        const { matricula, hashedPassword } = request.body;
        console.log(matricula)
        try {      
            const result = await db.find({ nombre: matricula, contra: hashedPassword }).toArray();
            
            if (result.length == 0) {
                response.status(401).json({ message: 'Credenciales inválidas' });
            } else {
                response.status(200).json({ message: 'Autenticación exitosa' });
            }

        } catch(err) {
            console.error(err);
            response.status(500).json({ message: 'Error interno del servidor' });
        }
    });
};