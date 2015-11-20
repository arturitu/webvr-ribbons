const budo = require('budo')
const opn = require('opn')
const fs = require('fs')
const simpleHtml = require('simple-html-index')

budo('src/index.js', {
    serve: 'js/index.js',
    live: true,
    dir: __dirname + '/app',
    stream: process.stdout,
    defaultIndex: function (opt) {
        var html = 'index.html';
        if (!fs.existsSync(html)) return simpleHtml(opt);
        return fs.createReadStream(html);
    },
    browserify: {
        transform: [
            [ 'installify', { save: true } ],
            [ 'glslify', { global: true } ]
        ]
    }
}).on('connect', function(ev) {
    const uri = ev.uri + 'index.html';
    opn(uri);
});
