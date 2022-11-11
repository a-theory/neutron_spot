import Categories         from '../../domain-model/categories.mjs';
import Base from '../../use-cases/Base.mjs';

export default class Create extends Base {
    async validate(data = {}) {
        const rules = {
            name : [ 'required', 'string' ],
            brief : [ 'required', 'string' ],
            userData : [ 'required' ],
        };

        return this.doValidation(data, rules);
    }

    async execute({ name, brief, userData}) {
        const category = await Categories.create({
            name: name,
            brief: brief,
        });

        return {
            // article: articleN
        };
    }
}
