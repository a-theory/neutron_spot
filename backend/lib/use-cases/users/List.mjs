import User         from '../../domain-model/users.mjs';
import Base from '../../use-cases/Base.mjs';

export default class List extends Base {
    async validate(data = {}) {
        const rules = {
            userData	: [	'required' ],
        };
        return this.doValidation(data, rules);
    }
    async execute({userData}) {
        const users = await User.findAll({
            where: {
                status: "VERIFIED"
            }
        });

        return {
            users
        };
    }
}
