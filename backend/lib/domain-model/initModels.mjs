import cls                     from 'cls-hooked';
import Sequelize               from 'sequelize';
import Users                    from './users.mjs';
import Articles                    from './articles.mjs';
import Categories                    from './categories.mjs';
import ArticlesToCategories             from './articles-to-categories.mjs';
import Keys                               from './keys.mjs';

const namespace = cls.createNamespace('sequelize');

Sequelize.useCLS(namespace);

export function initModels(dbConfig) {
    const { database, username, password, dialect, host, port } = dbConfig.development;

    const sequelize = new Sequelize(database, username, password, {
        host,
        port,
        dialect,
        logging : false
    });

    const models = {
        Users,
        Articles,
        Categories,
        ArticlesToCategories,
        Keys,
    };

    Object.values(models).forEach(model => model.init(sequelize));
    Object.values(models).forEach(model => model.initRelationsAndHooks(sequelize));

    return {
        ...models,
        sequelize
    };
}
