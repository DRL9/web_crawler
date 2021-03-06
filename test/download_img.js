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
        , dest = path.join(testDir, 'img.ico')
        ;

    before(() => fs.mkdirSync(testDir));

    it(`should download ${rightUrl} successfully`, () => {
        return downloadImg(rightUrl, dest).then(
            function fulfilled(v) {
                chai.assert.property(v, 'imgUrl');
                chai.assert.property(v, 'destPath');
                fs.existsSync(dest).should.be.true;
            }
        )
    });

    it('wrong destDir, should be rejected', () => {
        return downloadImg(rightUrl, path.join(testDir, 'tmp2/img2')).should.be.rejected;
    });

    it(`download ${errUrl} shoulde be rejected, err with property imgUrl, destPath`, () => {
        return downloadImg(errUrl, dest).catch((err) => {
            chai.assert.property(err, 'imgUrl');
            chai.assert.property(err, 'destPath');
        });
    });

    after(() => {
        fs.unlinkSync(dest);
        fs.rmdirSync(testDir);
    });
});