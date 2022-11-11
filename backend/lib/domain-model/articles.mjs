import Base from "./base.mjs";
import Users from "./users.mjs";
import Categories from "./categories.mjs";
import { DataTypes as DT }     from 'sequelize';

export default class Articles extends Base {
	static modelName = "Articles";

	static generateSchema() {
		this.modelSchema = {
			id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
			name: DT.STRING,
			brief: DT.STRING,
			url: DT.TEXT,
			status   : DT.ENUM('PROCESS', 'DONE'),

			createdAt : { type: DT.DATE, allowNull: false },
			updatedAt : { type: DT.DATE, allowNull: false }
		}
		return this.modelSchema;
	}

	static initRelations() {
		Articles.belongsTo(Users, {
			foreignKey: "userId",
			onDelete: "cascade",
		});
		Articles.belongsToMany(Categories, {
			through: "ArticlesToCategories",
			foreignKey: "articleId",
			onDelete: "cascade",
		});
	}
}
