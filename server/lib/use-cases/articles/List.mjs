import Articles         from '../../domain-model/articles.mjs';
import Base from '../../use-cases/Base.mjs';

export default class UsersList extends Base {
    async execute() {
        const articles = await Articles.findAll({order: [["updatedAt", "DESC"]]});

        console.log(articles);

        return {
            articles
        };
    }
}
