import { connDB } from './DBUtils.js';

let consoleLogLevel = 3;
let dbLogLevel = 3;
// log levels:
// -1: none
// 0: error
// 1: error, warn
// 2: error, warn, info
// 3: error, warn, info, debug

function setConsoleLogLevel(level) {
    consoleLogLevel = level;
}
function setDBLogLevel(level) {
    dbLogLevel = level;
}

let dbCollName = "logs";
let dbConn = null;

async function logSomethingToDB(env, user, message, type, route, attempts = 0) {
    if (attempts > 5) {
        console.log("Error al conectar con la base de datos, se ha intentado 5 veces, abortando");
        return;
    }
    try{
        if (dbConn == null) {
            dbConn = await connDB();
        }

        let db = dbConn.db.collection(dbCollName);
        let date = new Date();
        let log = {
            env: env,
            user: user,
            message: message,
            type: type,
            route: route,
            date: date
        };
        db.insertOne(log);
    }
    catch (ex) {
        console.log("Error al conectar con la base de datos, re-intentando: " + ex.message);
        dbConn = connDB();
        logSomethingToDB(env, user, message, type, route, attempts + 1);
    }
}

const error = async (user, message, route) => {
    if(dbLogLevel >= 0) {
        await logSomethingToDB(process.env.NODE_ENV, user, message, "ERROR", route);
    }
    if(consoleLogLevel >= 0) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(`ERROR: [${user}] ${route} error message: \n${message}`);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
}

const warn = async (user, message, route) => {
    if(dbLogLevel >= 0) {
        await logSomethingToDB(process.env.NODE_ENV, user, message, "WARN", route);
    }
    if(consoleLogLevel >= 1) {
        console.log(`WARN: [${user}] ${route}: ${message}`);
    }
}

const info = async (user, message, route) => {
    if(dbLogLevel >= 0) {
        await logSomethingToDB(process.env.NODE_ENV, user, message, "INFO", route);
    }
    if(consoleLogLevel >= 2) {
        console.log(`INFO: [${user}] ${route}: ${message}`);
    }
}

const debug = async (user, message, route) => {
    if(dbLogLevel >= 0) {
        await logSomethingToDB(process.env.NODE_ENV, user, message, "DEBUG", route);
    }
    if(consoleLogLevel >= 3) {
        console.log(`DEBUG: [${user}] ${route}: ${message}`);
    }
}

export default { error, warn, info, debug, setConsoleLogLevel, setDBLogLevel };