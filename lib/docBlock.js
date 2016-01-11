'use strict';

/**
 * Creates a DocBlock
 * @module  DocBlock
 *
 * @example {js}
 * var docBlock = new DocBlock();
 */
var DocBlock = function() {
    this.handlerFuncs = {
        'title': this.setTitle,
        'description': this.setDescription,
        'param': this.addParamTag,
        'const': this.createTypedTag,
        'module': this.setTag,
        'public': this.setPublic,
        'protected': this.setProtected,
        'private': this.setPrivate,
        'deprecated': this.setDeprecated,
        'example': this.addExampleTag
    };

    this.rules = {};    
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
            this.addUnknownValue(tag);
        }
        else if (this.customHandlerFuncs && this.customHandlerFuncs[tag.tag]) {
            this.customHandlerFuncs[tag.tag].call(this, tag);
        }
        else if (this.handlerFuncs[tag.tag]) {
            this.handlerFuncs[tag.tag].call(this, tag);
        }
        else {
            this.handleCustomTag(tag);
        }
        
    }, this);

    return this.block;
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
 * Creates an example block.
 *
 * @method addExampleTag
 * @param  {Object}  tag  BlockArray item
 */
DocBlock.prototype.addExampleTag = function(tag) {
    this.defineMultiTag('examples', {
        content: tag.value
    });
};

/**
 * Add a unknown value to the unknow property
 *
 * @method addUnknownValue
 * @param  {any}  value  Value
 */
DocBlock.prototype.addUnknownValue = function(value) {
    this.defineMultiTag('unknown', value);
};

/**
 * Set a param tag
 *
 * @method addParamTag
 * @param  {Object}  tag  BlockArray line
 */
DocBlock.prototype.addParamTag = function(tag) {
    var reg = /(?:\{([a-zA-Z0-9]+)\}\s+)?(\[?[a-zA-Z0-9]+\]?\s+)?(.+)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.defineMultiTag('unknown', tag);
    }

    this.defineMultiTag('params', {
        type: match[1].trim() || '',
        name: match[2].trim() || '',
        description: match[3].trim() || ''
    });
};

/**
 * Creates a tag, parse for type and name
 *
 * @method createTypedTag
 * @param  {Object}  tag  BlockArray line
 */
DocBlock.prototype.createTypedTag = function(tag) {
    var reg = /(?:\{([a-zA-Z0-9]+)\}\s*)?(\[?[a-zA-Z0-9]+\]?\s*)?(.+)?/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.defineMultiTag('unknown', tag);
    }

    var type = match[1] ? match[1].trim() : '';
    var name = match[2] ? match[2].trim() : this.stripNameFromSource(tag.tag, tag.source);
    var desc = match[3] ? match[3].trim() : '';

    this.defineTag(tag.tag, {
        type: type,
        name: name,
        description: desc
    });
};

/**
 * Strip name from code if any rule does exists
 *
 * @method stripNameFromSource
 * @param  {string}  tagName  Tag name
 */
DocBlock.prototype.stripNameFromSource = function(tagName) {
    var rule = this.rules[tagName];
    if (rule) {

    }

    return '';
};

module.exports = DocBlock;
