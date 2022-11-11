import Minio from "minio";

export async function initMinio(){
    const minioClient = new Minio.Client({
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: 'filatov',
        secretKey: 'A3302003a',
    });

    await minioClient.bucketExists('mysite', function(err, exists) {
        if (!exists) {
            minioClient.makeBucket('mysite', (err) => {
                if (err) {
                    console.log('minio error '+err);
                }
            });
        }
        if (err) {
            return console.log(err)
        }
    });

    await minioClient.bucketExists('mysiteimages', function(err, exists) {
        if (err) {
            return console.log(err)
        }
        if (!exists) {
            minioClient.makeBucket('mysiteimages', (err) => {
                if (err) {
                    console.log('minio error '+err);
                }
            });
        }
    });

    return minioClient;
}
