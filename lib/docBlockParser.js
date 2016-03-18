'use strict';

var DocBlock = require('./docBlock.js');
var marked = require('marked');

// marked.setOptions({
//     renderer: new marked.Renderer(),
//     gfm: true,
//     tables: true,
//     breaks: false,
//     pedantic: false,
//     sanitize: true,
//     smartLists: true,
//     smartypants: false
// });

var DocBlockParser = function DocBlockParser(conf) {
    conf = conf || {};
    this.docBlockPattern = conf.docBlockPattern || '\\\/\\\*\\\*[^]*?\\\*\\\/';
    this.docBlockStrip = '(^\\\s*\\\/\\\*\\\*)|(\\\*\\\/\\\s*$)';

    this.docLineStrip = '^\\\s*\\\*';

    /**
     * Skip markdown parsing
     * @property {boolean} skipMarkdown
     */
    this.skipMarkdown = conf.skipMarkdown || false;

    /**
     * Defines a doc tag pattern. 
     * 
     * The first capture group must match the tag name
     * The second capture group must macht the value
     *    
     * @property {string} docTagPattern
     */
    this.docTagPattern = '@([a-zA-Z][a-zA-Z0-9_-]+)(.*)';
};

/**
 * Parse source for DocBlocks
 * @param  {String} source Input source code
 * @return {Object}        Returns an array of DocBlocks
 */
DocBlockParser.prototype.parse = function(source, type) {
    if (typeof Buffer !== 'undefined' && source instanceof Buffer) {
        source = source.toString();
    }

    if (typeof source !== 'string') {
        throw new Error('Unknown input type!');
    }

    this.codeType = type;
    this.source = source;

    var reg = new RegExp(this.docBlockPattern, 'g');
    var match;

    var docBlocks = [];

    var loop = function() {
        return true;
    };

    while (loop()) {
        match = reg.exec(source);
        if (!match) {
            break;
        }

        docBlocks.push({ raw: match[0], pos: reg.lastIndex });
    }

    docBlocks = docBlocks.map(this.parseBlock, this);
    var prevPos = this.source.length;
    for (var i = docBlocks.length - 1; i > 0; i--) {
        var block = docBlocks[i];
        block.code = block.code.substr(0, prevPos - block.pos).replace(/\s+$/, '');
        prevPos = block.pos - block.raw.length - 1;
    }

    if (!this.skipMarkdown) {
        docBlocks = docBlocks.map(this.parseMarkdown);
    }

    return docBlocks;
};

/**
 * Parse a docblock
 * @param  {String} block DocBlock
 * @return {Object}       Returns a DocBlock object
 */
DocBlockParser.prototype.parseBlock = function(block) {
    var blockBody = block.raw.replace(new RegExp(this.docBlockStrip, 'g'), '');
    var tagArray = this.parseTags(blockBody.trim());

    var docBlock = new DocBlock(this.codeType);
    docBlock.setSourceLine(this.getLine(block.pos));
    docBlock.setSourceCode(this.codeType, this.stripSource(block.pos));
    docBlock.setSourceFile(this.codeType, '');

    var newBlock;
    try {
        newBlock = docBlock.create(tagArray);
    }
    catch(err) {
        throw new Error(err.message + '\n\n' + this.createCodeView(block));
    }

    newBlock.raw = block.raw;
    newBlock.pos = block.pos;

    return newBlock;
};



DocBlockParser.prototype.createCodeView = function(block) {
    var nextLine = this.getLine(block.pos);
    var codeView = block.raw.split('\n');
    
    codeView = codeView.map(function(line) {
        var lineNumber = String(' ' + nextLine).substr(-(String(nextLine + 6).length));
        nextLine++;
        return lineNumber + ' | ' + line.replace(/^\t|\s{2}/g, '');
    });

    return codeView.join('\n');
};

/**
 * Parse DocBlock body for tags
 * @param  {String} block DocBlock body
 * @return {Object}       Returns a DocBlock tags array
 */
DocBlockParser.prototype.parseTags = function(block) {
    var lines = this.stripBlockLines(block);
    var line = {
        tag: 'title',
        value: ''
    };

    var tags = [line];

    var lastIndention = null;
    var lastTag = line;

    var reg = new RegExp(this.docTagPattern);
    for (var i = 0, len = lines.length; i < len; i++) {
        var match = reg.exec(lines[i]);


        if (match && match[1]) {
            line = {};
            line.tag = match[1];
            line.value = match[2].trim();
            lastIndention = match.index;
            lastTag = line;
            tags.push(line);
        }
        else {
            if (lastIndention === null) {
                var testReg = /\S/.exec(lines[i]);
                if (testReg) {
                    lastIndention = testReg.index;
                }
            }

            var val = lines[i].substr(lastIndention);
            if (val) {
                lastTag.value += '\n' + val;
            }

            if (i === 0) {
                line = {
                    tag: 'description',
                    value: ''
                };

                lastTag = line;
                tags.push(line);
            }
        }
    }

    tags = tags.map(function(tag) {
        tag.value = tag.value.replace(/^\n|\s$/g, '');
        return tag;
    });

    return tags;
};

DocBlockParser.prototype.parseMarkdown = function(block) {
    var ignore = ['code', 'raw'];

    var parseMd = function(obj) {
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            if (ignore.indexOf(keys[i]) === -1) {
                if (typeof obj[keys[i]] === 'string') {
                    obj[keys[i]] = marked(obj[keys[i]]).replace(/(^<p>)|(<\/p>\n?$)/g, '');
                }
            }
            
            if (typeof obj[keys[i]] === 'object') {
                if (Array.isArray(obj[keys[i]])) {
                    obj[keys[i]] = obj[keys[i]].map(parseMd);
                }
                else if (obj[keys[i]] instanceof Object) {
                    obj[keys[i]] = parseMd(obj[keys[i]]);
                }
            }
        }

        return obj;
    };


    return parseMd(block);
};

DocBlockParser.prototype.stripBlockLines = function(block) {
    var lines = [];
    var line;

    
    var split = block.split('\n');
    var reg = new RegExp(this.docLineStrip);

    for (var i = 0, len = split.length; i < len; i++) {
        line = split[i].replace(reg, '');

        lines.push(line);
    }

    return lines;
};

/**
 * Gets line number of a specific index position
 *
 * @method getLine
 * @param  {number}  index  Gets line number relative to this index
 */
DocBlockParser.prototype.getLine = function(index) {
    var str = this.source.slice(0, index);
    str = str.split(/\n/);
    return str.length;
};

/**
 * Strips source
 *
 * @method stripSource
 * @param  {number}  pos  Start pos
 */
DocBlockParser.prototype.stripSource = function(index) {
    var source = this.source.substr(index);
    source = source.replace(/^\s+|\s+$/g, '');

//     var ch;
    var stopIndex = source.length;

//     var matches = {
//         comments: [
//             { start: '/*',  end: '*/' },
//             { start: '//',  end: '\n' }
//         ],
//         strings: [
//             { start: '"', end: '"' },
//             { start: '"', end: '"' }
//         ],
//         code: [
//             { start: '{', end: '}' },
//             { start: '[', end: ']' }
//         ]
//     };

//     var moveTo = function(i, chr) {
//         var chLen = chr.length;
//         for (var len = source.length; i < len; i++) {
//             ch = source.substr(i, chLen);

//             if (ch === chr) {
//                 return i;
//             }
//         }

//         return i;        
//     };

//     var findEnd = function(i, chr) {
//         var ch;
//         var chLen = chr.length;

//         for (var len = source.length; i < len; i++) {
//             ch = source.substr(i, chLen);

//             if (chr === ch) {
//                 return i;
//             }

//             for (var j = 0, jLen = matches.comments.length; j < jLen; j++) {
//                 if (source.substr(i, matches.comments[j].start.length) === matches.comments[j].start) {
//                     moveTo(i, matches.comments[j].end);
//                     continue;
//                 }
//             }

//             for (j = 0, jLen = matches.strings.length; j < jLen; j++) {
//                 if (source.substr(i, matches.strings[j].start.length) === matches.strings[j].start) {
//                     moveTo(i, matches.strings[j].end);
//                     continue;
//                 }
//             }

//             for (j = 0, jLen = matches.code.length; j < jLen; j++) {
//                 if (source.substr(i, matches.code[j].start.length) === matches.code[j].start) {
//                     findEnd(i, matches.code[j].end);
//                     continue;
//                 }
//             }
//         }

//         return i;       
//     };

//     for (var i = 0, len = source.length; i < len; i++) {
//         ch = source.charAt(i);
//         if (ch === '\n' || ch === ';') {
//             stopIndex = i;
//             break;
//         }

//         for (var j = 0, jLen = matches.comments.length; j < jLen; j++) {
//             if (source.substr(i, matches.comments[j].start.length) === matches.comments[j].start) {
//                 moveTo(i, matches.comments[j].end);
//                 continue;
//             }
//         }

//         for (j = 0, jLen = matches.strings.length; j < jLen; j++) {
//             if (source.substr(i, matches.strings[j].start.length) === matches.strings[j].start) {
//                 moveTo(i, matches.strings[j].end);
//                 continue;
//             }
//         }

//         for (j = 0, jLen = matches.code.length; j < jLen; j++) {
//             if (source.substr(i, matches.code[j].start.length) === matches.code[j].start) {
//                 findEnd(i, matches.code[j].end);
//                 continue;
//             }
//         }
//     }

//     if (source.charAt(stopIndex) === ';') {
//         stopIndex++;
//     }

    return source.slice(0, stopIndex);
};

module.exports = DocBlockParser;
