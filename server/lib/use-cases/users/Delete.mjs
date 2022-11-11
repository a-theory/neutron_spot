import User         from '../../domain-model/users.mjs';
import Base from '../../use-cases/Base.mjs';
import config from '#global-config' assert {type: 'json'};
import jwt from "jsonwebtoken";

export default class Update extends Base {
	async validate(data = {}) {
		const rules = {
			id	: [	'required', 'string'],
			userData	: [	'required' ],
		};
		return this.doValidation(data, rules);
	}
	async execute({ userData, id }) {
		return User.destroy({
			where: {
				id: id,
			}
		});
	}
}

