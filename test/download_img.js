const downloadImg = require('../lib/download_img')
    , path = require('path')
    , fs = require('fs')
    , chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    ;

chai.should();
chai.use(chaiAsPromised);

describe('download_img', () => {
    const testDir = path.join(__dirname, 'tmp')
        , rightUrl = 'https://www.baidu.com/favicon.ico'
        , errUrl = 'http://localhost:1000'
        , dist = path.join(testDir, 'img.ico')
        ;

    before(() => fs.mkdirSync(testDir));

    it(`should download ${rightUrl} successfully`, () => {
        return downloadImg(rightUrl, dist).then(
            function fulfilled(v) {
                chai.assert.property(v, 'imgUrl');
                chai.assert.property(v, 'distPath');
                fs.existsSync(dist).should.be.true;
            }
        )
    });

    it('wrong distDir, should be rejected', () => {
        return downloadImg(rightUrl, path.join(testDir, 'tmp2/img2')).should.be.rejected;
    });

    it(`download ${errUrl} shoulde be rejected, err with property imgUrl, distPath`, () => {
        return downloadImg(errUrl, dist).catch((err) => {
            chai.assert.property(err, 'imgUrl');
            chai.assert.property(err, 'distPath');
        });
    });

    after(() => {
        fs.unlinkSync(dist);
        fs.rmdirSync(testDir);
    });
});