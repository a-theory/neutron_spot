import Articles         from '../../domain-model/articles.mjs';
import Base from '../../use-cases/Base.mjs';

export default class Delete extends Base {
    async validate(data = {}) {
        const rules = {
            id : [ 'required', 'string' ],
            userData : [ 'required' ],
        };

        return this.doValidation(data, rules);
    }

    async execute({ id, userData }) {
        await Articles.destroy({ where: { id } });
        return {};
    }
}

