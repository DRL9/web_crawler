const path = require('path'),
    crawler = require('../crawler'),
    htmlExtractor = require('../html_extractor'),
    initDir = require('../init_dir'),
    downloadImg = require('../download_img');
/**
 *
 * @param {String} url - 介绍页面url
 * @param {String} saveDir - 漫画保存目录
 */
function fetch(url, saveDir, startPage = 1, endPage) {
    var comicsIntro,
        comicsDir,
        it = gen(),
        curPageUrl,
        process = new Process(() => {
            retry(process, comicsDir);
        });

    crawler
        .crawlWithRetry(url)
        .then((introHtml) => {
            comicsIntro = htmlExtractor.extractComicsIntroduce(introHtml);
            console.log(comicsIntro);
            comicsDir = path.join(
                saveDir,
                comicsIntro.title || comicsIntro.subtitle
            );
            process.setTotalPageNum(comicsIntro.totalPageNum);
            return initDir(comicsDir);
        })
        .then(() => {
            curPageUrl = comicsIntro.firstPageUrl;
            it.next();
        })
        .catch((err) => {
            process.handleError(err);
        });

    function* gen() {
        process.startDownload();
        let prevPageUrl = curPageUrl;
        for (
            let curPageNum = 1;
            curPageNum <= (endPage || comicsIntro.totalPageNum);
            curPageNum++
        ) {
            prevPageUrl = curPageUrl;
            curPageUrl = yield crawlComics(
                curPageUrl,
                process,
                comicsDir,
                it,
                startPage
            );
            if (prevPageUrl === curPageUrl) {
                console.warn('pageUrl equal', prevPageUrl, curPageUrl);
                break;
            }
        }
    }
}

/**
 *
 * @param {String} pageUrl
 * @param {Iterator} it
 * @param {Process} process
 * @return {Promise}
 */
function crawlComics(pageUrl, process, comicsDir, it, startPage = 1) {
    crawler
        .crawlWithRetry(pageUrl)
        .then((contentHtml) => {
            var comicsInfo = htmlExtractor.extractComicsContent(contentHtml),
                destPath = path.join(
                    comicsDir,
                    `${comicsInfo.curPageNum.toString().padStart(4, '0')}.jpg`
                );
            console.log(
                'parse complete ',
                comicsInfo.curPageNum,
                'next',
                comicsInfo.nextPageUrl
            );
            it.next(comicsInfo.nextPageUrl);
            if (comicsInfo.curPageNum >= startPage) {
                console.log(
                    'start download ',
                    comicsInfo.curPageNum,
                    comicsInfo.curComicsUrl
                );
                downloadImg(comicsInfo.curComicsUrl, destPath).then(
                    function fulfilled() {
                        process.downloadComplete(pageUrl);
                    },
                    function rejected(err) {
                        process.downloadError(pageUrl, err);
                    }
                );
            }
        })
        .catch((err) => {
            process.handleError(err);
        });
}

/**
 *
 * @param {*} pageUrl
 * @param {Process} process
 * @param {*} comicsDir
 */
function crawlComicsWithImg(pageUrl, process, comicsDir) {
    return crawler
        .crawlWithRetry(pageUrl)
        .then((contentHtml) => {
            var comicsInfo = htmlExtractor.extractComicsContent(contentHtml),
                destPath = path.join(comicsDir, `${comicsInfo.curPageNum}.jpg`);
            return { comicsInfo, destPath };
        })
        .then(({ comicsInfo, destPath }) => {
            return downloadImg(comicsInfo.curComicsUrl, destPath);
        })
        .then(
            function fulfilled() {
                process.downloadComplete(pageUrl);
            },
            function rejected(err) {
                process.downloadError(pageUrl, err);
            }
        );
}

/**
 *
 * @param {Process} process
 * @param {Number} retryCount
 */
function retry(process, comicsDir, retryCount = 3) {
    var it = gen();
    process.onComplete = null;
    function* gen() {
        for (let i = 1; i <= retryCount; i++) {
            let promises = [];
            var errors = process.clearDownloadError();
            for (var pageUrl in errors) {
                promises.push(crawlComicsWithImg(pageUrl, process, comicsDir));
            }
            if (promises.length == 0) break;

            Promise.all(promises).then(() => {
                console.log(`第${i}次retry complete`);
                it.next();
            });
            yield;
        }
    }
    it.next();
}

class Process {
    /**
     *
     * @param {Function} onComplete
     */
    constructor(onComplete) {
        this._errDownloads = {};
        this._successCount = 0;
        this._failCount = 0;
        this.onComplete = onComplete;
    }
    setTotalPageNum(totalPageNum) {
        this._totalPageNum = totalPageNum;
    }
    startDownload() {
        console.log('start');
    }
    downloadComplete(pageUrl) {
        console.log(pageUrl + ' donwload complete');
        this._successCount++;
        this._NotifyComplete();
    }
    downloadError(pageUrl, err) {
        this._errDownloads[pageUrl] = err;
        this._failCount++;
        this._NotifyComplete();
    }
    handleError(err) {
        console.log(err);
    }
    /**
     * 清除并返回错误下载的errors
     * @return {Object} errs
     */
    clearDownloadError() {
        this._failCount = 0;
        var errs = this._errDownloads;
        this._errDownloads = {};
        return errs;
    }
    _NotifyComplete() {
        if (this._failCount + this._successCount == this._totalPageNum) {
            console.log(`all complete. ${this._failCount} failed`);
            this.onComplete && this.onComplete();
        }
    }
}

module.exports = fetch;
