var fs = require('fs');
var DocBlock = require('./lib/docBlockParser');

var source = fs.readFileSync('./examples/banana.js');
var docBlock = new DocBlock();
docBlock.parse(source, 'js');
