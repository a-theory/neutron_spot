import Categories         from '../../domain-model/categories.mjs';
import Base from '../../use-cases/Base.mjs';

export default class List extends Base {
    async execute() {
        const categories = await Categories.findAll({
            order: [["name", "ASC"]]
        });

        return {
            categories
        };
    }
}
