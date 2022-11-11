import Base from "./base.mjs";
import Users from "./users.mjs";
import { DataTypes as DT }     from 'sequelize';

export default class Keys extends Base {
	static modelName = "Keys";

	static generateSchema() {
		this.modelSchema = {
			id: {type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true},
			refresh: DT.TEXT,
			access: DT.TEXT,
			userAgent: DT.TEXT,
			userId: DT.UUID,

			createdAt : { type: DT.DATE, allowNull: false },
			updatedAt : { type: DT.DATE, allowNull: false }
		}
		return this.modelSchema;
	}

	static initRelations() {
		Keys.belongsTo(Users, {foreignKey: "userId", onDelete: "cascade"});
	}
}
