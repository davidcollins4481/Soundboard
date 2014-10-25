var express = require('express');

var fs = require('fs');
var nosql = require('nosql').load('data/database.nosql');
var bodyParser = require('body-parser');

//https://github.com/expressjs/multer
var multer  = require('multer');
var app = express();

app.use(multer({
    dest: './audio/',
    onFileUploadStart: function(file) {
    },
    onFileUploadData: function(file, data) {
        console.log(data.length + ' of ' + file.size + ' arrived')
    },
    onFileUploadComplete: function(file) {
        var callback = function() {};
        nosql.insert({
            originalName: file.originalname,
            name: file.name,
            mimeType: file.mimetype,
            fileSize: file.size
        }, callback);
    }
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// static resources
app.use('/js', express.static(__dirname + '/client'));
app.use('/bower', express.static(__dirname + '/bower_components'));
app.use('/sounds', express.static(__dirname + '/audio'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/css', express.static(__dirname + '/css'));

app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

// functions to move
function getSounds(callback) {
    callback = callback || function() {};
    nosql.all(function(doc) { return doc;}, function(all) {
        callback(all);
    });
}

app.get('/', function(req, res){
    res.render('index.html', { text: 'The index page!' });
});

app.post('/upload', function (req, res) {
    getSounds(function(sounds) {
        res.json(sounds);
        res.status(200).end();
    })
});

app.get('/getsounds', function(req, res) {
    getSounds(function(sounds) {
        res.json(sounds);
        res.status(200).end();
    })
});

app.post('/deletesound', function(req, res) {
    var filename = req.body.filename;

    console.log("file: " + filename);
    var filter = function(doc) {
        return doc.name == filename;
    };

    nosql.remove(filter, function() {
        getSounds(function(sounds) {
            res.json(sounds);
            res.status(200).end();
        });
    });
});
