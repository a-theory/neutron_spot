import Articles         from '../../domain-model/articles.mjs';
import Base from '../../use-cases/Base.mjs';
import {initMinio} from "../../minio/index.mjs";

export default class GetOne extends Base {
    async validate(data = {}) {
        const rules = {
            id : [ 'required', 'string' ]
        };

        return this.doValidation(data, rules);
    }

    async execute({ id }) {
        const article = await Articles.findOne({ where: { id } });
        const minioClient = await initMinio();
        const buffer = await call({minioClient, url: article.url});

        return {
            article,
            html: buffer.toString()
        };
    }
}

async function call({minioClient, url}) {
    let fileName;

    let position = url.indexOf("?");
    // let position2 = url.indexOf("mysite");
    let ok = false;
    for (let i = 0; i < position; i++){
        if (ok){
            fileName += url[i]
        }
        if (url[i] === '/'){
            ok = true
            fileName = ''
        }
    }

    const promise = new Promise((resolve, reject) => {
        var buff = [];
        var size = 0;

        minioClient.getObject("mysite", fileName).then(function(dataStream) {
            dataStream.on('data', async function(chunk) {
                buff.push(chunk)
                size += chunk.length
            })
            dataStream.on('end', function() {
                resolve(buff)
            })
            dataStream.on('error', function(err) {
                console.log(err)
                reject(err)
            })
        }).catch(reject);

    })

    return promise

}
