var yargs = require('yargs')
    , path = require('path')
    ;

yargs.options({
    'url': {
        alias: 'u',
        describe: '漫画介绍页url',
        demandOption: true
    },
    'dist': {
        alias: 'd',
        describe: '保存位置(默认{当前进程所在目录}/download)'
    }
});

yargs.command('fetch', '下载漫画', {

}, function (argv) {
    var url = argv['url']
        , dist = argv['dist'] || path.join(process.cwd(), 'download')
        ;
    console.log(url, dist);
});

yargs.help().argv;
