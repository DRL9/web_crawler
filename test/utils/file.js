var assert = require('assert')
    , file = require('../../lib/utils/file')
    ;

describe('utils', () => {
    describe('file', () => {
        describe('.getFileNameWithoutExtName(filePath)', () => {
            var right = new Map();
            right.set('file.ext', 'file')
                .set('/dir/file.ext', 'file')
                .set('file', 'file')
                .set('...', '.')
                .set('....', '..')
                ;

            right.forEach((filename, filePath) => {
                it(`can parse ${filePath}`, () => {
                    var result = file.getFilenameWithoutExtName(filePath);
                    assert(filename === result);
                });
            });

            var wrong = ['', '.', '..', '.js'];
            wrong.forEach((filePath) => {
                it(`cannot parse ${filePath}`, () => {
                    assert.throws(() => {
                        file.getFilenameWithoutExtName(filePath);
                    })
                });
            })


        });
    });

});