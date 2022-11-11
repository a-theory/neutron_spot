import Base from "./base.mjs";
import { DataTypes as DT }     from 'sequelize';

export default class ArticlesToCategories extends Base {
	static modelName = "ArticlesToCategories";

	static generateSchema() {
		this.modelSchema = {
			id: {type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true},
			articleId: DT.UUID,
			categoryId: DT.UUID,

			createdAt : { type: DT.DATE, allowNull: false },
			updatedAt : { type: DT.DATE, allowNull: false }
		}
		return this.modelSchema;
	}

	static initRelations() {}
}
