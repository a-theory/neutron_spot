import jwt from 'jsonwebtoken';
import argon2  from 'argon2';
import User         from '../../domain-model/users.mjs';
import Base from '../../use-cases/Base.mjs';
import config from '#global-config' assert {type: 'json'};
import crypto from 'crypto'
import Keys from "../../domain-model/keys.mjs";
import {encryptAES} from "../utils/encryption.mjs";
import {Exception} from "../Exception.mjs";

export default class login extends Base {
    async validate(data = {}) {
        const rules = {
            email   	: [	'required', 'email', { min_length: 3, max_length: 255 } ],
            password	: [	'required', 'string', { min_length: 8, max_length: 20 } ],
            useragent	: [	'required' ],
        };

        return this.doValidation(data, rules);
    }

    async execute({ email, password, useragent }) {
        const user = await User.findOne({ where: { email } });

        if (!user){
            throw new Exception({
                code   : 'LOGIN_ERROR',
                fields : {email: "user is not found"}
            })
        }

        const prevKeys = await Keys.findOne({where: {userId: user.id}});
        if (prevKeys){
            throw new Exception({
                code   : 'LOGIN_ERROR',
                fields : {token: "user is busy"}
            })
        }

        const errors = {};
        const isVerified = await argon2.verify(user.password, password);
        if (!isVerified) errors.password = 'incorrect passport';
        if (user.status === 'UNVERIFIED') errors.user_unverified = 'unverified user';
        if (Object.keys(errors).length) {
            throw new Exception({
                code   : 'LOGIN_ERROR',
                fields :  errors
            })
        }

        const accessToken = await jwt.sign(
            { id: user.id },
            config.accessTokenKey,
            { expiresIn: '3m' }
        );

        const keyAccessToken = crypto.randomBytes(32);
        const encryptedAccessToken = encryptAES(accessToken, keyAccessToken)

        const refreshToken = await jwt.sign(
            { id: user.id },
            config.refreshTokenKey, { expiresIn: '1d' }
        );
        const keyRefreshToken = crypto.randomBytes(32);
        const encryptedRefreshToken = encryptAES(refreshToken, keyRefreshToken)

        await Keys.create({
            userId: user.id,
            refresh: keyRefreshToken.toString('hex'),
            access: keyAccessToken.toString('hex'),
            userAgent: useragent
        })

        return {
            userId: user.id,
            accessToken: encryptedAccessToken.toString('hex'),
            refreshToken: encryptedRefreshToken.toString('hex')
        };
    }
}
