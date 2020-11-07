var yargs = require('yargs'),
    path = require('path'),
    fetch = require('./lib/cli_args/fetch');

yargs.options({});

yargs.command(
    'fetch',
    '下载漫画',
    {
        dest: {
            alias: 'd',
            describe: '保存位置(默认{当前进程所在目录}/download)'
        },
        url: {
            alias: 'u',
            describe: '漫画介绍页url',
            demandOption: true
        }
    },
    function (argv) {
        var url = argv['url'],
            dest = argv['dest'] || path.join(process.cwd(), 'download');
        console.log('url', url, 'dest', dest);
        fetch(url, dest);
    }
);

yargs.help().argv;
