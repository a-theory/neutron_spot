import express     from 'express';

import controllers from './controllers/index.mjs';
import multer from "../middlewares/multer.mjs";
import {validateAccessToken, validateRefreshToken} from "../middlewares/token.mjs";
// import middlewares from './../middlewares.mjs';


const router = express.Router();
// const { fileUpload, detectDevice, detectIp, sequelizeSession, errorHandler } = middlewares;
// const { check } = controllers.sessions;

export default function init({sequelize}) {
    // router.use(sequelizeSession({ sequelize }));
    // router.use(fileUpload().any());
    // router.use(csrfProtection);

    // users
    router.get('/users', validateAccessToken, controllers.users.show);
    router.get('/users/requests', validateAccessToken, controllers.users.showRequests);
    router.get('/gpg',  controllers.users.getGpg);
    router.patch('/user', validateAccessToken, controllers.users.update);
    router.delete('/user', validateAccessToken, controllers.users.delete);

    // articles
    router.get('/articles',  controllers.articles.show);
    router.get('/article',  controllers.articles.getOne);
    router.post('/article', multer.single("file"), validateAccessToken, controllers.articles.create);
    router.post('/articles/image', multer.single("file"), validateAccessToken, controllers.articles.uploadImage);
    router.delete('/article', validateAccessToken, controllers.articles.delete);

    // categories
    router.get('/categories',  controllers.categories.show);
    router.get('/category',  controllers.categories.getOne);
    router.post('/category', validateAccessToken,  controllers.categories.create);
    router.delete('/category', validateAccessToken,  controllers.categories.delete);

    // authentication
    router.post('/login',  controllers.authentication.login);
    router.post('/register',  controllers.authentication.register);
    router.post('/refresh', validateRefreshToken, controllers.authentication.refresh);
    router.post('/logout', validateAccessToken, controllers.authentication.logout);

    // router.use(errorHandler);

    return router;
}

