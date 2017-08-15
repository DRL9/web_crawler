const http = require('http')
    , url = require('url')
    , qs = require('querystring')
    ;

var server = http.createServer((req, resp) => {
    var uri = url.parse(req.url);
    var params = qs.parse(uri.query);

    switch (uri.pathname) {
        case '/timeout':
            handleTimeOut(params, resp);
            break;
        case '/wrongresp':
            resp.statusCode = parseInt(params['code']);
            resp.end();
            break;
        case '/right':
            resp.statusCode - 200;
            resp.end(params['content']);
            break;
    }
});

function handleTimeOut(params, resp) {
    setTimeout(function () {
        resp.end();
    }, parseInt(params['time']));
}


server.listen(3001);