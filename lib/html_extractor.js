/**
 * 用'.{0,}?'连接两个正则表达式
 * @param {RegExp} patterns
 * @return {RegExp}
 */
function concatRegExp(...patterns) {
    var pattern = patterns.reduce((pre, cur) => {
        return pre + '.{0,}?' + cur.source
    }, '');
    return new RegExp(pattern);
}

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
     * @property {String} subtitle
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
        var reg_title = /<h1 id="gn">(.+?)<\/h1>/,
            reg_subtitle = /<h1 id="gj">(.{0,}?)<\/h1>/,
            reg_page = /<div id="gdd">.+?(\d+?) pages/,
            reg_taglist = /<div id="taglist">.{0,}?<table>(.+?)<\/table>.{0,}?<\/div>/,
            reg_first_page_url = /<div id="gdt">.+?<a href="(.+?)">/;
        var pattern = concatRegExp(
            reg_title
            , reg_subtitle
            , reg_page
            , reg_taglist
            , reg_first_page_url
        );
        var result = pattern.exec(html);

        if (result instanceof Array) {
            var reg_tag = /"td_female:(.+?)"/g,
                tagResult,
                tagList = [];
            while (true) {
                tagResult = reg_tag.exec(result[4]);
                if (tagResult == null) {
                    break;
                }
                tagList.push(tagResult[1])
            }
            return {
                title: result[1],
                subtitle: result[2] || '',
                totalPageNum: parseInt(result[3]),
                tags: tagList,
                firstPageUrl: result[5]
            };
        }
        throw new Error('提取介绍页面信息失败');
    }
}
