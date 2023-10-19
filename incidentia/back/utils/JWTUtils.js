import jwt from 'jsonwebtoken';
import config from './config.js';

// creation

export function makeNewToken(userData) {
    const { id, nombre } = userData;
    const payload = {
        id: id,
        nombre: nombre,
        iat: Date.now(),
        // expire in 60 minutes
        exp: Date.now() + 1000 * 60 * 60,
    };

    let token = jwt.sign(payload, config.SECRET, { algorithm: 'HS256' });
    return token;
}

// Verification shit

export function verifyToken(token) {
    let decoded = jwt.verify(token, config.SECRET);
    return decoded;
}

export function verifyTokenFromReq(req) {
    const { authorization:token } = req.headers
    let decoded = verifyToken(token);
    return decoded
}

export function getUsernameFromJWT(req) {
    try {
        let token = req.headers.authorization;
        let decoded = verifyToken(token);
        return decoded.nombre;
    }
    catch {
        return "Sin usuario"
    }
}

// Extra shit

// function that returns a mongodb filter that is built based on the parameters that an endpoint checks for
export function buildFilter(decodedToken, req, mongoConn) {
    let filter = {};
    // get user from connection
    let users = mongoConn.collection("coordinadores");

    // get user from token
    let user = users.filter({ nombre: decodedToken.name }).first();

    // if user does not exist: exit
    if (!user) {
        // raise exception
        return false; 
    }

    if (user.rol == "admin") {
        // admin can see all
        return filter;
    } 
    else if (user.rol == "aula") {
        // user can only see his own data
        //filter = { user: decodedToken.name }; // TODO agregar permisos para el admin
        return filter;
    }
    else {
        for (let i = 0; i < req.length; i++) {
            req[i] = req[i].toString();
            filter[req[i]] = { $eq: user[req[i]]};
        }
        return filter;
    }
}
