const request = require('request')
    , fs = require('fs')
    , path = require('path')
    ;

/**
 * 
 * @param {String} imgUrl 
 * @param {String} destPath
 * @return {Promise}
 */
function downloadImg(imgUrl, destPath) {
    return new Promise(function (resolve, reject) {
        var dir = path.dirname(destPath);
        fs.access(dir, (err) => {
            if (err) {
                return reject(err);
            }

            var req = request(imgUrl),
                stream = fs.createWriteStream(destPath)
                ;

            req.on('error', (err) => {
                err.imgUrl = imgUrl;
                err.destPath = destPath;
                stream.end();
                reject(err);
            });

            req.on('complete', () => {
                resolve({ imgUrl, destPath });
            });

            req.pipe(stream);
        });
    });
}

module.exports = downloadImg;
