import {Exception} from "../../use-cases/Exception.mjs";
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: './log/error.log', level: 'error' }),
        new winston.transports.File({ filename: './log/combined.log' }),
    ],
});

export async function runUseCase(useCaseClass, { context = {}, params = {} }) {
    const result = await new useCaseClass({ context }).run(params);

    return result;
}

export function makeUseCaseRunner(
    useCaseClass,
    paramsBuilder,
    params,
    render = renderPromiseAsJson
) {
    return async function useCaseRunner(req, res, next) {
        const resultPromise = runUseCase(useCaseClass, {
            params : paramsBuilder(req, res),
        });

        return render(req, res, resultPromise, next);
    };
}

export async function renderPromiseAsJson(req, res, promise) {
    try {
        const data = await promise;

        data.status = 1;
        logger.log({
            level: 'info',
            ...createLogData(req, res)
        });

        return res.send(data);
    } catch (error) {
        /* istanbul ignore next */
        if (error instanceof Exception) {
            logger.log({
                level: 'error',
                messageError: error.toHash(),
                ...createLogData(req, res)
            })

            res.status(400).send(error);
        } else {
            logger.log({
                level: 'error',
                messageError: error.message,
                ...createLogData(req, res)
            })
            console.log(error);
            res.status(400).send({
                code    : 'SERVER_ERROR',
                fields : {error: 'Please, contact your system admin!'}
            });
        }
    }
}

function createLogData(req, res){
    return {
        message: `HTTP ${req.method} ${res.statusCode} ${req.url}`,
        meta: {
            ip: req.ips.length ? req.ips : req.ip,
            // ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            protocol: req.protocol,
            hostname: req.hostname,
            req: {
                headers: req.headers,
                data: req.data,
                params: req.params,
                query: req.query,
                httpVersion: req.httpVersion,
                originalUrl: req.originalUrl,
                method: req.method,
            },
            res: {
                statusCode: res.statusCode,
            },
            time: new Date(),
        }
    }
}
