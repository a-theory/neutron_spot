import Categories         from '../../domain-model/categories.mjs';
import Base from '../../use-cases/Base.mjs';

export default class Delete extends Base {
    async validate(data = {}) {
        const rules = {
            id : [ 'required', 'string' ],
            userData : [ 'required' ]
        };

        return this.doValidation(data, rules);
    }

    async execute({ id, userData }) {
        await Categories.destroy({
            where: { id },
        });
        return {};
    }
}
