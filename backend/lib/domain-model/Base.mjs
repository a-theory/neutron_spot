import Sequelize      from 'sequelize';

class Base extends Sequelize.Model {
    static init(sequelize, options = {}) {
        if (this.generateSchema) {
            this.generateSchema();
        }

        super.init(this.modelSchema, {
            tableName : this.tableName,
            ...options,
            sequelize,
            ...this.options
        });
    }

    static initRelationsAndHooks() {
        if (this.initRelations) this.initRelations();
        if (this.initHooks) this.initHooks();
    }
}

export default Base;
