/**
 * @todo 考虑使用generator的方案，而不是使用递归
 */

var fs = require('fs'),
    path = require('path');
/**
 *
 * @param {Array} dirArr - 按索引顺序创建目录
 * @param {Function} resolve
 */
function mkdir(dirArr, resolve, reject) {
    if (dirArr.length == 0) {
        return resolve();
    }
    var dir = dirArr.shift();
    if (fs.existsSync(dir)) {
        return mkdir(dirArr, resolve, reject);
    }
    fs.mkdir(dir, function (err) {
        if (err) return reject(err);
        mkdir(dirArr, resolve, reject);
    });
}

/**
 *
 * @param {Array} dirArr
 */
function dirExists(dirArr, resolve, reject) {
    var dir = dirArr[0];
    fs.exists(dir, function (exists) {
        if (exists) {
            dirArr.shift();
            resolve();
            return;
        }
        var parentDir = path.dirname(dir);
        if (parentDir == dir) {
            return reject(new Error('该路径的根目录不存在'));
        }
        dirArr.unshift(parentDir);
        dirExists(dirArr, resolve, reject);
    });
}

/**
 * 如果指定目录不存在，创建它
 * @param {String} dir
 * @return {Promise}
 */
function initDir(dir) {
    var dirArr = [dir];
    return new Promise((resolve, reject) => {
        dirExists(dirArr, resolve, reject);
    }).then(function fulfilled() {
        return new Promise((resolve, reject) => {
            mkdir(dirArr, resolve, reject);
        });
    });
}

module.exports = initDir;
