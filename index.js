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
        },
        begin: {
            alias: 'b',
            describe: '开始页面'
        },
        end: {
            alias: 'e',
            describe: '结束页面'
        }
    },
    function (argv) {
        var url = argv['url'],
            dest = argv['dest'] || path.join(process.cwd(), 'download');
        let begin = argv['begin'] || 1;
        let end = argv['end'];
        console.log('url', url, 'dest', dest, 'begin', begin, end);
        fetch(url, dest, begin, end);
    }
);

yargs.help().argv;
