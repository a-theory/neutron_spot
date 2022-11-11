import Articles         from '../../domain-model/articles.mjs';
import ArticlesToCategories         from '../../domain-model/articles-to-categories.mjs';
import Users         from '../../domain-model/users.mjs';
import Categories         from '../../domain-model/categories.mjs';
import Base from '../../use-cases/Base.mjs';
import {initMinio} from "../../minio/index.mjs";

export default class Create extends Base {
    async validate(data = {}) {
        const rules = {
            userData : [ 'required' ],
            name : [ 'required', 'string' ],
            brief : [ 'required', 'string' ],
            categories : [ 'required' ],
            file : [ 'required' ],
        };

        return this.doValidation(data, rules);
    }

    async execute({ file, categories, name, brief, userData}) {
        // const htmlString = file.buffer.toString()
        // if (htmlString.search("<script") !== -1){
        //     throw Error("HTML_ERROR");
        // }
        const minioClient = await initMinio();

        const originalname = file.originalname.split(' ');
        const fileName = `${new Date().getTime()}-${originalname.join('_')}`;

        await minioClient.putObject('mysite', fileName, file.buffer);
        const url = await minioClient.presignedGetObject('mysite', fileName);
        // const url2 = await minioClient.presignedUrl('GET', 'mysite', fileName)

        const article = await Articles.create({
            name: name,
            brief: brief,
            url: url,
            userId: userData.id,
        });

        if (categories[0].length > 1){
            for (const i of categories){
                await ArticlesToCategories.create({
                    articleId: article.id,
                    categoryId: i
                });
            }
        } else {
            await ArticlesToCategories.create({
                articleId: article.id,
                categoryId: categories
            });
        }

        return {};
    }
}
