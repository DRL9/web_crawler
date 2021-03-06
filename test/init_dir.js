var initDir = require('../lib/init_dir'),
    path = require('path'),
    fs = require('fs'),
    assert = require('assert'),
    chai = require('chai'),
    chaiAsPormised = require('chai-as-promised'),
    should = require('chai').should();
chai.use(chaiAsPormised);

describe('init_dir', () => {
    var testDir = path.join(__dirname, 'tmp'),
        rightDir = [];
    before(() => {
        fs.mkdirSync(testDir);
    });

    rightDir.push(testDir);
    rightDir.push(path.join(testDir, 'sub1'));
    rightDir.push(path.join(testDir, 'sub1', 'sub2'));
    rightDir.push(path.join(testDir, 'sub1', 'sub2'));

    rightDir.forEach((dir) => {
        it(`can init_dir ${dir}`, (done) => {
            initDir(dir).then(() => {
                if (fs.existsSync(dir)) {
                    done();
                    return;
                }
                done(new Error(`${dir} init failed`));
            });
        });
    });

    after(() => {
        rightDir
            .slice(0, rightDir.length - 1)
            .reverse()
            .forEach((dir) => {
                fs.rmdirSync(dir);
            });
    });
});
