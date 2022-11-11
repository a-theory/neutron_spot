import List from '../../../../use-cases/categories/List.mjs';
import GetOne from '../../../../use-cases/categories/GetOne.mjs';
import { makeUseCaseRunner } from '../../serviceRunner.mjs';
import Create from "../../../../use-cases/categories/Create.mjs";
import Delete from "../../../../use-cases/categories/Delete.mjs";

export default {
	show   : makeUseCaseRunner(List, req => ({ ...req.query, ...req.params })),
	getOne : makeUseCaseRunner(GetOne, req => ({ ...req.query, ...req.params })),
	create : makeUseCaseRunner(Create, req => ({ ...req.query, ...req.params, ...req.body, userData: req.userData })),
	delete : makeUseCaseRunner(Delete, req => ({ ...req.query, ...req.params, userData: req.userData})),
};
