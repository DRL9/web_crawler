/**
 * 用来提取介绍页面和内容页面的相关信息
 */
module.exports = {
    /**
     * @typedef {Object} ContentInfo
     * @property {String} nextPageUrl - 下一内容页url
     * @property {String} curComicsUrl - 此页漫画图片url
     * @property {Number} curPageNum - 当前页码
     * @property {Number} totalPageNum - 总页数
     */
    /**
     * 提取漫画内容页面相关信息
     * @param {String} html
     * @return {ContentInfo} - 内容页面信息
     * @throws '提取失败时抛出异常'
     */
    extractComicsContent: function (html) {
        var reg = /<div><span>(\d+)<\/span> \/ <span>(\d+)<\/span><\/div>.*?<a id="next".+?href="(.+?)".+?<img id="img" src="(.+?)"/;
        var result = reg.exec(html);

        if (result instanceof Array) {
            return {
                nextPageUrl: result[3],
                curComicsUrl: result[4],
                curPageNum: parseInt(result[1]),
                totalPageNum: parseInt(result[2])
            };
        }
        throw new Error('提取内容页面信息失败');
    },
    /**
     * @typedef {Object} IntroduceInfo
     * @property {String} title
     * @property {String} firstPageUrl - 内容第一页url
     * @property {Number} totalPageNum - 总页数
     * @property {Array} tags 
     */
    /**
     * 提取漫画介绍页面相关信息
     * @param {String} html
     * @return {IntroduceInfo} - 介绍页相关信息
     * @throws '提取失败时抛出异常'
     */
    extractComicsIntroduce: function (html) {
        var reg = /<div>/;
        var result = reg.exec(html);

        if (result instanceof Array) {
            return {

            };
        }
        throw new Error('提取介绍页面信息失败');
    }
}