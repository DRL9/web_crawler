const request = require('request')
    , fs = require('fs')
    , path = require('path')
    ;

/**
 * 
 * @param {String} imgUrl 
 * @param {String} distPath
 * @return {Promise}
 */
function downloadImg(imgUrl, distPath) {
    return new Promise(function (resolve, reject) {
        var dir = path.dirname(distPath);
        fs.access(dir, (err) => {
            if (err) {
                return reject(err);
            }

            var req = request(imgUrl),
                stream = fs.createWriteStream(distPath)
                ;

            req.on('error', (err) => {
                err.imgUrl = imgUrl;
                err.distPath = distPath;
                stream.end();
                reject(err);
            });

            req.on('complete', () => {
                resolve({ imgUrl, distPath });
            });

            req.pipe(stream);
        });
    });
}

module.exports = downloadImg;
