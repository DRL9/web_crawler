const chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    , crawler = require('../lib/crawler')
    , server = require('../test_server')
    ;

chai.should();
chai.use(chaiAsPromised);

describe('crawler', () => {
    before(() => {
        server.listen();
    });

    after(() => {
        server.close();
    });

    describe('.crawl(url)', function () {
        this.timeout(4000);

        it('should be rejected because of timeout', () => {
            return crawler.crawl('http://localhost:3001/timeout?time=2000', 2000).should.be.rejected;
        });

        it('should be rejected because of wrong resp code', () => {
            return crawler.crawl('http://localhost:3001/wrongresp?code=404').should.be.rejected;
        });

        it('should be resolved', () => {
            return crawler.crawl('http://localhost:3001/right?content=hello').should.eventually.equal('hello');
        });
    });

    describe('.crawlWithRetry(url)', () => {
        it('should be resolved', () => {
            return crawler.crawlWithRetry('http://localhost:3001/right?content=hello').should.eventually.equal('hello');
        });

        it('should be rejected', () => {
            return crawler.crawlWithRetry('http://localhost:3001/wrongresp?code=404', 2).should.be.rejectedWith(Error, /第3次失败/)
        });
    });
});