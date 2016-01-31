var fs = require('fs');
var DocBlock = require('../lib/docBlockParser');

var source = fs.readFileSync('./banana.js');
var docBlock = new DocBlock();
var result = docBlock.parse(source, 'js');

console.log(JSON.stringify(result, null, '    '));
