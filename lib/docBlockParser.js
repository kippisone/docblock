'use strict';

var DocBlock = require('./docBlock.js');

var DocBlockParser = function DocBlockParser(conf) {
    conf = conf || {};
    this.docBlockPattern = conf.docBlockPattern || '\\\/\\\*\\\*[^]*?\\\*\\\/';
    this.docBlockStrip = '(^\\\s*\\\/\\\*\\\*)|(\\\*\\\/\\\s*$)';

    this.docLineStrip = '^\\\s*\\\*';

    /**
     * Defines a doc tag pattern. 
     * 
     * The first capture group must match the tag name
     * The second capture group must macht the value
     *    
     * @type {string}
     */
    this.docTagPattern = '@([a-zA-Z][a-zA-Z0-9_-]+)(.*)';
};

/**
 * Parse source for DocBlocks
 * @param  {String} source Input source code
 * @return {Object}        Returns an array of DocBlocks
 */
DocBlockParser.prototype.parse = function(source, type) {
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

    var newBlock = docBlock.create(tagArray);
    newBlock.raw = block.raw;
    newBlock.pos = block.pos;

    return newBlock;
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
