var request = require('request')
    ;

/**
 * 爬取指定url的内容
 * @param {String} url
 * @param {String} timeout
 * @return {Promise} - Promise with body
 */
function crawl(url, timeout = 20000) {
    return new Promise((resolve, reject) => {
        var timer = setTimeout(function () {
            reject(new Error(`请求超时, url: ${url}`));
        }, timeout);
        request(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
            }
        }, (err, resp, body) => {
            clearTimeout(timer);
            if (err) return reject(err);

            if (Math.floor(resp.statusCode / 100) != 2) return reject(new Error(`响应错误, statuCode: ${resp.statusCode}`));

            resolve(body);
        });
    });
}

/**
 * 爬取指定url的内容
 * @param {String} url 
 * @param {Number} retryCount - 重试次数 
 * @param {Promise} - Promise with body
 */
function crawlWithRetry(url, retryCount = 3) {
    return new Promise(function (resolve, reject) {
        var it = gen(),
            errMsg = '';

        function* gen() {
            for (let i = 0; i <= retryCount; i++) {
                yield crawl(url).then(function fulfilled(v) {
                    resolve(v);
                }, function rejejected(err) {
                    errMsg += `\n第${i + 1}次失败: ${err.message}`;
                    it.next();
                });
            }
            reject(new Error(errMsg));
        }
        it.next();
    });
};

module.exports.crawl = crawl;
module.exports.crawlWithRetry = crawlWithRetry;