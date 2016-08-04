'use strict';

var DocBlock = require('./docBlock.js');
var marked = require('marked');
var fluf = require('fluf');

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

  this.docLineStrip = '^\\\s*\\\* ?';

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
  this.docTagPattern = '\\\\?@(?!\{)([a-zA-Z][a-zA-Z0-9_-]+)(.*)';
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

  var prevPos = this.source.length;
  for (var i = docBlocks.length - 1; i >= 0; i--) {
    var block = docBlocks[i];
    var code = this.source.slice(block.pos, prevPos);
    prevPos = block.pos - block.raw.length;

    block.code = this.undentCode(code);
  }

  docBlocks = docBlocks.map(this.parseBlock, this);
  if (!this.skipVars) {
    docBlocks.forEach(this.parseInlineTags);
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
  var line = this.getLine(block.pos);
  docBlock.setSourceLine(line);
  docBlock.setSourceCode(this.codeType, block.code);
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
      if (match[0][0] === '\\') {
        lastTag.value += '\n' + lines[i].replace('\\@', '@');
        continue;
      }
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
    tag.value = tag.value
    .replace(/^ |\t$/g, '')
    .replace(/\\\//g, '/');
    return tag;
  });

  return tags;
};

DocBlockParser.prototype.parseMarkdown = function(block) {
  var whiteList = ['title', 'description'];

  var parseMd = function(obj) {
    var keys = Object.keys(obj);
    for (var i = 0, len = keys.length; i < len; i++) {
      if (typeof obj[keys[i]] === 'string') {
        if (whiteList.indexOf(keys[i]) !== -1) {
          obj[keys[i]] = marked(obj[keys[i]]).replace(/(^<p>)|(<\/p>\n?$)/g, '');
        }

        continue;
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

DocBlockParser.prototype.undentCode = function (code) {
  var split = code.split('\n');
  var indention = null;
  var buffer = [];

  for (var i = 0, l = split.length; i < l; i++) {
    if (indention === null) {
      if (/^\s*$/.test(split[i])) {
        continue;
      }

      var match = /^\s+/.exec(split[i]);
      if (match) {
        indention = new RegExp('^' + match[0]);
      }
      else {
        buffer = split.slice(i);
        break;
      }
    }

    var line = split[i].replace(indention, '');
    if (line === split[i] && /\S+/.test(line)) {
      // No indention removed, must be next scope.
      break;
    }

    buffer.push(line);
  }

  return buffer.join('\n').trim();
};

DocBlockParser.prototype.parseInlineTags = function(block) {
  var reg = /\@\{([a-zA-Z0-9._-]+)\}/g;
  block = fluf(block);
  block.walk(function(value, key) {
    if (this.type === 'string') {
      var self = this;
      return value.replace(reg, function(m, key) {
        var blockItem = block.get(key) || '';
        if (Array.isArray(blockItem)) {
          return blockItem[self.index] || '';
        }

        return blockItem || '';
      });
    }
  });

  return block.toJSON();
}

DocBlockParser.prototype.toJSON = function () {

};

module.exports = DocBlockParser;
