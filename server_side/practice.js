const http = require('http');

console.log('this is the server')

const server = http.createServer((req, res) => {
    res.write('hello world');
    res.end('we are ready')
    server.listen(3000, () => {
        console.log('server listening at port 3000 ...');
    });
});