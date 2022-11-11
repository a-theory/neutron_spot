import Categories         from '../../domain-model/categories.mjs';
import Articles         from '../../domain-model/articles.mjs';
import Base from '../../use-cases/Base.mjs';

export default class GetOne extends Base {
    async validate(data = {}) {
        const rules = {
            id : [ 'required', 'string' ]
        };

        return this.doValidation(data, rules);
    }

    async execute({ id }) {
        const category = await Categories.findOne({
            where: { id },
            include: [
                {model: Articles},
            ],
            order: [[Articles, "updatedAt", "DESC"]],
        });
        return {
            category
        };
    }
}
