import Base from "./base.mjs";
import Articles from "./articles.mjs";
import { DataTypes as DT }     from 'sequelize';

export default class Categories extends Base {
	static modelName = "Categories";

	static generateSchema() {
		this.modelSchema = {
			id: {type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true},
			name: DT.STRING,
			brief: DT.STRING,

			createdAt : { type: DT.DATE, allowNull: false },
			updatedAt : { type: DT.DATE, allowNull: false }
		}
		return this.modelSchema;
	}

	static initRelations() {
		Categories.belongsToMany(Articles, {
			through: "ArticlesToCategories",
			foreignKey: "categoryId",
			onDelete: "cascade",
		});
	}
}
