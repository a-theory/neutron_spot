import Base from '../../use-cases/Base.mjs';
import User from '../../domain-model/users.mjs';

export default class Update extends Base {
	async validate(data = {}) {
		const rules = {
			id	: [	'required', 'string'],
			userData	: [	'required' ]
		};

		return this.doValidation(data, rules);
	}
	async execute({id, userData}) {
		const user = await User.findByPk(id);

		await user.update({ status: 'VERIFIED' });

		return { user };
	}
}

