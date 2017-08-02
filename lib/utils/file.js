var path = require('path')
    ;

var reg = /(.+)\..+$/;

/**
 * 获取不带扩展名的文件名
 * @param {String} filePath 
 */
function getFilenameWithoutExtName(filePath) {
    var filename = path.basename(filePath);
    const err_msg = `输入参数有误,filePath = ${filePath}`;

    if (filename == '') {
        throw new Error(err_msg);
    }
    if (filename.indexOf('.') == -1) {
        return filename;
    }
    var result = reg.exec(filename);
    if (result == null || result.length < 2) throw new Error(err_msg);
    return result[1];
}

module.exports = {
    getFilenameWithoutExtName
}
