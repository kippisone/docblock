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

    var docBlock = new DocBlock();
    docBlock.setSourceCode(this.codeType, this.stripSource(block.pos));

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
 * Strips source
 *
 * @method stripSource
 * @param  {number}  pos  Start pos
 */
DocBlockParser.prototype.stripSource = function(index) {
    var source = this.source.substr(index);

    var ch;
    var stopIndex = source.length;

    var moveTo = function(i, brace, skip) {
        var counter = 0;
        var ch;

        for (var len = source.length; i < len; i++) {
            ch = source[i];

            if (ch === skip && source[i-1] !== '\\') {
                counter++;
                continue;
            }

            if (ch === brace) {
                if (counter === 0) {
                    return i;
                }
                else {
                    counter--;
                }
            }
        }

        return i;       
    };

    for (var i = 0, len = source.length; i < len; i++) {
        ch = source.charAt(i);
        if (ch === '\n' || ch === ';') {
            stopIndex = i;
            break;
        }

        if (ch === '{') {
            i++;
            i = moveTo(i, '}', '{');
        }
    }

    if (source.charAt(stopIndex) === ';') {
        stopIndex++;
    }

    console.log('STRIP', index, stopIndex, source.slice(index, stopIndex));
    return source.slice(index, stopIndex);
};

module.exports = DocBlockParser;
