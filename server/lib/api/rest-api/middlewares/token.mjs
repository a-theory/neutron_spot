import jwt from "jsonwebtoken";
import Users from "../../../domain-model/users.mjs";
import config from '#global-config' assert {type: 'json'};
import {decryptAES} from "../../../use-cases/utils/encryption.mjs";
import Keys from "../../../domain-model/keys.mjs";

export async function validateAccessToken(req, res, next) {
    await validateToken(req, res, next, true);
}

export async function validateRefreshToken(req, res, next) {
    await validateToken(req, res, next, false);
}

async function validateToken(req, res, next, isAccess) {
    try {
        const {token, key, user} = await tokenDecryption(req, res, isAccess)
        await tokenSecure(token, key, user, res, isAccess);

        delete user.dataValues.Keys;
        req.userData = user.dataValues;

        await next();
    } catch (e) {
        res.status(401).send({
            error: "WRONG_TOKEN"
        });
    }
}

async function tokenSecure(token, key, user, res, isAccess){
    try {
        const {id, exp} = jwt.verify(token, key);
        if (id !== user.id){
            throw Error();
        }
    } catch (e) {
        const keys = await Keys.findByPk(user.Keys[0].id);
        if (isAccess){
            await keys.update({access: "UNDEF"});
            return new Error();
        } else {
            if (keys.access !== "UNDEF"){
                throw res.status(400).send({
                    error: "SECURE_TOKEN_ERROR"
                });
            }
            await keys.destroy();
        }
    }
}

async function tokenDecryption(req, res, isAccess) {
    let userId;
    if (req.body?.userId) userId = req.body?.userId;
    else if (req.query?.userId) userId = req.query?.userId;

    const user = await Users.findOne({
        where: {id : userId},
        include: [{
            model: Keys,
            where: {
                useragent: req.headers['user-agent']
            }
        }]
    });

    if (user?.Keys?.length > 1) {
        return res.status(400).send({
            error: "WRONG_TOKEN_SECURE"
        });
    }

    const keys = user.Keys[0];
    let key = isAccess ?
        keys.access : keys.refresh;
    key = Buffer.from(key, 'hex');

    const tokenEnc = getToken(req);
    const token = decryptAES(tokenEnc, key)
    const conf = isAccess ? config.accessTokenKey : config.refreshTokenKey
    return {token, key: conf, user: user}
}

export function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }

    if (req.query && req.query.token) {
        return req.query.token;
    }

    if (req.params && req.params.token) {
        return req.params.token;
    }

    if (req.get('X-AuthToken')) {
        return req.get('X-AuthToken')
    }

    return null;
}

// function isTokenExpired(token) {
//     const payloadBase64 = token.split('.')[1];
//     const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
//     const decoded = JSON.parse(decodedJson)
//     const exp = decoded.exp;
//     return (Date.now() >= exp * 1000)
// }
