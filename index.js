var yargs = require('yargs')
    , path = require('path')
    , fetch = require('./lib/cli_args/fetch')
    ;

yargs.options({
});

yargs.command('fetch', '下载漫画', {
    'dist': {
        alias: 'd',
        describe: '保存位置(默认{当前进程所在目录}/download)'
    },
    'url': {
        alias: 'u',
        describe: '漫画介绍页url',
        demandOption: true
    }
}, function (argv) {
    var url = argv['url']
        , dist = argv['dist'] || path.join(process.cwd(), 'download')
        ;
    fetch(url, dist);
});

yargs.help().argv;
