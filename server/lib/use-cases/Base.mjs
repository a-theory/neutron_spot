import LIVR from 'livr';
import { Exception } from './Exception.mjs';

import '../utils/livr.mjs';


export default class UseCaseBase {
    static sequelizeInstanse = null;

    constructor({ context }) {
        this.context = context;
    }

    static setSequelizeInstanse(sequelize) {
        UseCaseBase.sequelizeInstanse = sequelize;
    }

    static setAppConfig(config) {
        UseCaseBase.appConfig = config;
    }

    async run(args) {
        return UseCaseBase.sequelizeInstanse.transaction(async () => {
            let result = null;

            let cleanParams = args;

            if (this?.validate) {
                cleanParams = await this.validate(args);
            }

            result = this.execute(cleanParams);

            return result;
        });
    }


    async doValidation(data, rules) {
        const validator = new LIVR.Validator(rules).prepare();
        const result = validator.validate(data);

        if (!result) {
            const exception = new Exception({
                code   : 'FORMAT_ERROR',
                fields : validator.getErrors()
            });

            throw exception;
        }

        return result;
    }
}
