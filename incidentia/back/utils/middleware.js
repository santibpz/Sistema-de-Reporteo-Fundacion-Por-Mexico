import logger from "./logger.js"
import { getUsernameFromJWT } from "./JWTUtils.js"

// params["req"], params["message"], "info", params["route"]
const requestLogger = (request, response, next) => {
    logger.info(getUsernameFromJWT(request), `Usando ${request.method} para ${request.path}`, request.path);
    next()
}

const unknownEndpoint = (request, response) => {
    let ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    logger.warn(getUsernameFromJWT(request), `WARN-001: INFO: {IP: ${ip}} Usuario intento acceder a pagina que no existe`, request.path);
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(getUsernameFromJWT(request), error.message, request.path)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }

    next(error)
}

export default {
    requestLogger,
    unknownEndpoint,
    errorHandler
}
