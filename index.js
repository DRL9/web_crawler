var yargs = require('yargs')
    , path = require('path')
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
    /**
     * @todo 处理该命令
     */
    console.log(url, dist);
});

yargs.help().argv;
