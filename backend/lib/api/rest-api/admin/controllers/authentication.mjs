import Login from '../../../../use-cases/authentication/login.mjs';
import Register from '../../../../use-cases/authentication/register.mjs';
import Refresh from '../../../../use-cases/authentication/refresh.mjs';
import Logout from '../../../../use-cases/authentication/logout.mjs';
import { makeUseCaseRunner } from '../../serviceRunner.mjs';

export default {
    login       : makeUseCaseRunner(Login, (req, res) => ({
        ...req.query,
        ...req.params,
        ...req.body,
        useragent: req.headers["user-agent"],
    })),
    logout       : makeUseCaseRunner(Logout, (req, res) => ({
        userData: req.userData,
    })),
    register    : makeUseCaseRunner(Register, req => ({
        ...req.query,
        ...req.params,
        ...req.body
    })),
    refresh    : makeUseCaseRunner(Refresh, (req, res) => ({
        ...req.query,
        ...req.params,
        ...req.body,
        userData: req.userData
    })),
};
