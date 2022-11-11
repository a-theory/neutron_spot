import List from '../../../../use-cases/users/List.mjs';
import ListRequests from '../../../../use-cases/users/ListRequests.mjs';
import Update from '../../../../use-cases/users/Update.mjs';
import GetGpg from '../../../../use-cases/users/GetGpg.js';
import Delete from "../../../../use-cases/users/Delete.mjs";
import { makeUseCaseRunner } from '../../serviceRunner.mjs';

export default {
    show   : makeUseCaseRunner(List, req => ({ ...req.query, ...req.params, userData: req.userData })),
    showRequests   : makeUseCaseRunner(ListRequests, req => ({ ...req.query, ...req.params, userData: req.userData })),
    update : makeUseCaseRunner(Update, req => ({ ...req.query, ...req.params, ...req.body, userData: req.userData })),
    getGpg : makeUseCaseRunner(GetGpg, req => ({ ...req.query, ...req.params })),
    delete : makeUseCaseRunner(Delete, req => ({ ...req.query, ...req.params, ...req.body, userData: req.userData}))
};
