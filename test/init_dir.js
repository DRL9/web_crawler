var initDir = require('../lib/init_dir')
    , path = require('path')
    , fs = require('fs')
    , assert = require('assert')
    ;

describe('init_dir', () => {
    var testDir = path.join(__dirname, 'tmp')
        , rightDir = []
        , wrongDir = 'Z:\\'
        ;

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
                fs.exists(dir, (exists) => {
                    if (exists) {
                        done();
                        return;
                    }
                    done(new Error(`${dir} init failed`));
                })
            })
        });
    });

    it(`cannot init ${wrongDir}`, (done) => {
        initDir(wrongDir).then(() => {
            done(new Error('应该抛出异常'))
        }, () => {
            done();
        });
    });

    after(() => {
        rightDir.slice(0, rightDir.length - 1).reverse().forEach((dir) => {
            fs.rmdirSync(dir);
        });
    });
});