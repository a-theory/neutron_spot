import Base from '../../use-cases/Base.mjs';
import config from '#global-config' assert {type: 'json'};
import Keys from "../../domain-model/keys.mjs";

export default class logout extends Base {
    async validate(data = {}) {
        const rules = {
            userData	: [	'required' ],
        };

        return this.doValidation(data, rules);
    }

    async execute({ userData }) {
        const keys = await Keys.findOne({where: {userId: userData.id}})
        await keys.destroy();

        return {};
    }
}
