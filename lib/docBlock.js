'use strict';

/**
 * Creates a DocBlock
 * @module  DocBlock
 *
 * @example {js}
 * var docBlock = new DocBlock();
 */
var DocBlock = function(type) {
    this.rules = {};
    this.parseMethods = {};
    this.lastTag;

    var rules = require('./rules/all');
    Object.keys(rules.parseMethods).forEach(function(key) {
        this.parseMethods[key] = typeof rules.parseMethods[key] === 'function' ? rules.parseMethods[key] : this[rules.parseMethods[key]];
    }, this);

    if (type === 'js') {
        rules = require('./rules/javascript');
        this.rules = rules.rules;
    }
    else if (type === 'css' || type === 'less' || type === 'styl' || type === 'scss' || type === 'sass') {
        rules = require('./rules/styles');
        this.rules = rules.rules;
    }
    else {
        rules = null;
    }

    if (rules) {
        Object.keys(rules.parseMethods).forEach(function(key) {
            this.parseMethods[key] = typeof rules.parseMethods[key] === 'function' ? rules.parseMethods[key] : this[rules.parseMethods[key]];
        }, this);
    }
};

DocBlock.prototype.create = function(docArray) {
    this.block = {
        title: '',
        description: '',
        tags: {
            isPublic: false,
            isProtected: false,
            isPrivate: false,
            isDeprecated: false,
            ignore: false
        },
        code: this.code || ''
    };

    docArray.forEach(function(tag, index) {
        if (tag.tag === undefined) {
            this.addUnknownTag(tag);
        }
        else if (this.parseMethods[tag.tag]) {
            this.parseMethods[tag.tag].call(this, tag);
        }
        else {
            this.handleCustomTag(tag);
        }

    }, this);

    return this.block;
};

/**
 * Sets a block group
 * @param {string} group Block group
 */
DocBlock.prototype.setGroup = function(group) {
    this.block.group = group;
};

/**
 * Sets a block name
 * @param {string} name Block name
 */
DocBlock.prototype.setName = function(name) {
    this.block.name = name;
};

/**
 * Sets a tag. Overrides existing tags
 *
 * @method defineTag
 * @param  {Object}  tag  DocArray item
 */
DocBlock.prototype.defineTag = function(tag, value) {
    if (typeof tag !== 'string') {
        throw new Error('Tag name must be a string!');
    }
    this.block.tags[tag] = value;
    this.lastTag = this.block.tags[tag];
};

/**
 * Sets a multi tag
 *
 * @method defineMultiTag
 * @param  {Object}  tag  BlockArray item
 */
DocBlock.prototype.defineMultiTag = function(tag, value) {
    if (typeof tag !== 'string') {
        throw new Error('Tag name must be a string!');
    }
    if (!this.block.tags[tag]) {
        this.block.tags[tag] = [];
    }

    this.block.tags[tag].push(value);
    this.lastTag = this.block.tags[tag][this.block.tags[tag].length - 1];
};

/**
 * Sets a multi tag
 *
 *
 *
 * @method defineMultiTag
 * @param  {Object}  tag  BlockArray item
 */
DocBlock.prototype.defineMultiSubTag = function(tag, value) {
    if (typeof tag !== 'string') {
        throw new Error('Tag name must be a string!');
    }

    if (!this.lastTag) {
        throw new Error('No parent tag set for @' + tag);
    }

    if (typeof this.lastTag !== 'object') {
        throw new Error('Parent tag has wrong type for sub tag @' + tag);
    }

    if (!this.lastTag[tag]) {
        this.lastTag[tag] = [];
    }

    this.lastTag[tag].push(value);
};

/**
 * Adds a source code
 *
 * @method setSourceCode
 * @param  {string}  type  Code type
 * @param  {string}  code  Source code
 */
DocBlock.prototype.setSourceCode = function(type, code) {
    this.codeType = type;
    this.code = code;
};

/**
 * Sets source code file
 *
 * @method setSourceFile
 * @param  {string}  type  File type
 * @param  {string}  file  Source file
 */
DocBlock.prototype.setSourceFile = function(type, file) {
    this.sourceType = type;
    this.sourceFile = file;
};

/**
 * Sets line number where source starts
 *
 * @method setSourceLine
 * @param  {number}  line  Line number
 */
DocBlock.prototype.setSourceLine = function(line) {
    this.codeLine = line;
};

/**
 * Makes DocBlock public
 */
DocBlock.prototype.setPublic = function() {
    this.block.tags.isPublic = true;
    this.block.tags.isProtected = false;
    this.block.tags.isPrivate = false;
};

/**
 * Makes DocBlock protected
 */
DocBlock.prototype.setProtected = function() {
    this.block.tags.isPublic = false;
    this.block.tags.isProtected = true;
    this.block.tags.isPrivate = false;
};

/**
 * Makes DocBlock private
 */
DocBlock.prototype.setPrivate = function() {
    this.block.tags.isPublic = false;
    this.block.tags.isProtected = false;
    this.block.tags.isPrivate = true;
};

/**
 * Makes DocBlock deprecated
 *
 * @param {string} [version] Deprecated since version
 */
DocBlock.prototype.setDeprecated = function(version) {
    this.block.tags.isDeprecated = version || true;
};

/**
 * Sets a DocBlock title
 *
 * @param {string} title Doc block title
 */
DocBlock.prototype.setTitle = function(title) {
    if (title.tag && title.tag === 'title') {
        title = title.value;
    }

    this.block.title = title;
};

/**
 * Sets a DocBlock description
 *
 * @param {string} description Doc block description
 */
DocBlock.prototype.setDescription = function(description) {
    if (description.tag && description.tag === 'description') {
        description = description.value;
    }

    this.block.description = description;
};

/**
 * Makes DocBlock deprecated
 *
 * @param {string} [version] Deprecated since version
 */
DocBlock.prototype.setDeprecated = function(version) {
    this.block.tags.isDeprecated = version || true;
};

/**
 * Handles custom tags
 *
 * @method handleCustomTag
 * @param  {String}  tag  BlockArray item
 */
DocBlock.prototype.handleCustomTag = function(tag) {
    this.defineTag(tag.tag, tag.value);
};

/**
 * Creates a multiblock. The block name will be pluralized.
 *
 * @method addMultiBlock
 * @param  {Object}  tag  BlockArray item
 */
DocBlock.prototype.addMultiBlock = function(tag) {
    this.defineMultiTag(tag.tag, tag.value);
};

/**
 * Creates an return tag
 *
 * @method setReturnTag
 * @param  {Object}  tag  BlockArray item
 */
DocBlock.prototype.setReturnTag = function(tag) {
    this.defineTag(tag.tag, true);
};

/**
 * Creates an tag
 *
 * @method setReturnTag
 * @param  {Object}  tag  BlockArray item
 */
DocBlock.prototype.setTag = function(tag) {
    this.defineTag(tag.tag, tag.value || true);
};

/**
 * Creates an flag
 *
 * @method setFlag
 * @param  {Object}  tag  BlockArray item
 */
DocBlock.prototype.setFlag = function(tag) {
    this.defineTag('is' + tag.tag.charAt(0).toUpperCase() + tag.tag.substr(1), true);
};

/**
 * Add a unknown value to the unknow property
 *
 * @method addUnknownTag
 * @param  {onject} tag Unknown tag
 */
DocBlock.prototype.addUnknownTag = function(tag) {
    this.defineMultiTag('unknown', tag);
};

/**
 * Matches a regular expression against the source ans returns first matching capture group
 *
 * @method stripFromSource
 * @param  {regexp}  pattern  Pattern as a regexp. First capture groub will be returned
 */
DocBlock.prototype.stripFromSource = function(pattern) {
    var match = pattern.exec(this.code);
    if (match) {
        return match[1] || '';
    }

    return '';
};

/**
 * Runs a regexp match against the source
 *
 * @method matchSource
 * @param  {regexp}  reg  RegExp pattern
 * @returns {object} Returns a regexp ecec result
 */
DocBlock.prototype.matchSource = function(reg) {
    return reg.exec(this.code);
};

/**
 * Returns whether a parent tag was set or not
 *
 * A parent tag is needed by child tags
 *
 * @method hasParentTag
 */
DocBlock.prototype.hasParentTag = function() {
    return typeof this.parentTag === 'object' && this.parentTag;
};

module.exports = DocBlock;
