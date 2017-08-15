const assert = require('chai').assert
    , fs = require('fs')
    , path = require('path')
    , htmlExtractor = require('../lib/html_extractor')
    ;

describe('html_extractor', () => {
    describe('.extractComicsContent(html)', () => {
        it('should return ContentInfo when pass right html', () => {
            var html = fs.readFileSync(path.join(__dirname, './text_content/extract_comics_content_html'));
            var result = htmlExtractor.extractComicsContent(html);

            assert.property(result, 'nextPageUrl');
            assert.property(result, 'curComicsUrl');
            assert.property(result, 'curPageNum');
            assert.property(result, 'totalPageNum');

            assert.isString(result.nextPageUrl);
            assert.isString(result.curComicsUrl);
            assert.isNumber(result.curPageNum);
            assert.isNumber(result.totalPageNum);
        });

        it('should throw error when pass wrong html', () => {
            assert.throw(() => {
                htmlExtractor.extractComicsContent('wronghtml')
            });
        });
    });

    describe('.extractComicsIntroduce(html)', () => {
        it('should return IntroduceInfo when pass right html', () => {
            var html = fs.readFileSync(path.join(__dirname, './text_content/extract_comics_introduce_html'));
            var result = htmlExtractor.extractComicsIntroduce(html);

            assert.property(result, 'title');
            assert.property(result, 'subtitle');
            assert.property(result, 'firstPageUrl');
            assert.property(result, 'totalPageNum');
            assert.property(result, 'tags');

            assert.isString(result.title);
            assert.isString(result.subtitle);
            assert.isSealed(result.firstPageUrl);
            assert.isNumber(result.totalPageNum);
            assert.isArray(result.tags);
        });

        it('should throw error when pass wrong html', () => {
            assert.throw(() => {
                htmlExtractor.extractComicsIntroduce('wronghtml')
            });
        });
    });
});