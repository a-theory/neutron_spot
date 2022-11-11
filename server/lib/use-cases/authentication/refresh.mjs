import jwt from 'jsonwebtoken';
import Base from '../../use-cases/Base.mjs';
import config from '#global-config' assert {type: 'json'};
import Keys from "../../domain-model/keys.mjs";
import crypto from "crypto";
import {encryptAES} from "../utils/encryption.mjs";

export default class refresh extends Base {
    async validate(data = {}) {
        const rules = {
            userData	: [	'required' ],
        };

        return this.doValidation(data, rules);
    }

    async execute({ userData }) {
        const keys = await Keys.findOne({where: {userId: userData.id}})

        const accessToken = await jwt.sign(
            { id: userData.id },
            config.accessTokenKey,
            { expiresIn: '3m' }
        );
        const keyAccessToken = crypto.randomBytes(32);
        const encryptedAccessToken = encryptAES(accessToken, keyAccessToken)

        await keys.update({access: keyAccessToken.toString('hex')});

        return { accessToken: encryptedAccessToken };
    }
}
