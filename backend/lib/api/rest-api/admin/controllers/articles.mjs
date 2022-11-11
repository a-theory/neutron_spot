import List from '../../../../use-cases/articles/List.mjs';
import GetOne from '../../../../use-cases/articles/GetOne.mjs';
import Create from '../../../../use-cases/articles/Create.mjs';
import { makeUseCaseRunner } from '../../serviceRunner.mjs';
import Delete from "../../../../use-cases/articles/Delete.mjs";
import UploadImage from "../../../../use-cases/articles/UploadImage.mjs";

export default {
	show   : makeUseCaseRunner(List, req => ({ ...req.query, ...req.params })),
	getOne : makeUseCaseRunner(GetOne, req => ({...req.query, ...req.params})),
	create : makeUseCaseRunner(Create, req => ({
		...req.query,
		...req.body,
		...req.params,
		file : req.file,
		userData: req.userData
	})),
	delete : makeUseCaseRunner(Delete, req => ({...req.query, ...req.params, userData: req.userData})),
	uploadImage : makeUseCaseRunner(UploadImage, req => ({
		file : req.file,
		userData: req.userData
	})),
};
