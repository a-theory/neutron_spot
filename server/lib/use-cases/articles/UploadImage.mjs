import Base from '../../use-cases/Base.mjs';
import {initMinio} from "../../minio/index.mjs";

export default class UploadImage extends Base {
    async validate(data = {}) {

        const rules = {
            userData : [ 'required' ],
            file : [ 'required' ],
        };

        return this.doValidation(data, rules);
    }

    async execute({ file, userData}) {
        const minioClient = await initMinio();

        const originalname = file.originalname.split(' ');
        const fileName = `${new Date().getTime()}-${originalname.join('_')}`;

        console.log(fileName)

        await minioClient.putObject('mysiteimages', fileName, file.buffer);
        const url = await minioClient.presignedGetObject('mysiteimages', fileName);

        return {url}
    }
}
