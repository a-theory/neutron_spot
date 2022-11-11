import argon2  from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import User         from '../../domain-model/users.mjs';
import Base from '../../use-cases/Base.mjs';

export default class register extends Base {
    async validate(data = {}) {
	    const rules = {
            password	: [	'required', 'string', { min_length: 8, max_length: 20 } ],
            email   	: [	'required', 'email', { min_length: 3, max_length: 255 } ],
            name	: [	'required', 'string', { min_length: 1, max_length: 25 } ],
        };

	    return this.doValidation(data, rules);
    }

    async execute({ password, email, name }) {
        const passwordHash = await argon2.hash(password);
        const usrDb = await User.createUser({
            id       : uuidv4(),
            password : passwordHash,
            email,
            name,
        });

        return {};
    }
}
