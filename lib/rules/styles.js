'use strict';

var addParamTag = function(tag) {
    var reg = /(?:\{(.+?)\}\s+)?(?:(\[?[a-zA-Z0-9$_]+\]?)\s+)?(.+)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    var newTag = {
        type: match[1] || '',
        name: match[2] || '',
        description: match[3] || ''
    };

    var name = match[1];

    if (name.charAt(0) === '[' && name.charAt(name.length - 1) === ']') {
        newTag.optional = true;
        name = name.slice(1, -1).split('=');
        if (name.length === 2) {
            newTag.default = name[1];
        }

        newTag.name = name[0];
    }

    this.defineMultiTag('params', newTag);
};

var setFunctionTag = function(tag) {
    this.defineTag(tag.tag, tag.value);
    this.setGroup(tag.tag);
    this.setName(tag.value);

    this.setGroup(tag.tag);
    this.setName(tag.value);
};

var setVarTag = function(tag) {
    var reg = /(?:\{(.+?)\}\s*)?(\[?[a-zA-Z0-9$_-]+\]?\s*)?(.+)?/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    var name = match[2] ? match[2] : this.stripFromSource(/^(?:var|let|const)\s+([a-zA-Z][a-zA-Z0-9$_]*)/);

    this.defineTag(tag.tag, {
        type: match[1] || '',
        name: name,
        description: match[3] || ''
    });

    this.setGroup(tag.tag);
    this.setName(name);
};

/**
 * Style tags, can be used to describe your CSS, LESS, Stylus, SCSS or SASS files
 *
 * @module Styles
 */
module.exports.parseMethods = {
    /**
     * Describes a variable
     *
     * @group Tags
     * @name @var
     * @example {js}
     * /**
     *  * Variable title
     *  * \@variable {string} foo
     *  *\/
     */
    'var': setVarTag,

    /**
     * Describes a mixin
     *
     * @group Tags
     * @name @mixin
     * @example {js}
     * /**
     *  * Mixin title
     *  * \@mixin fooMixin
     *  *\/
     */
    'mixin': setFunctionTag,

    /**
     * Describes a function
     *
     * @group Tags
     * @name @function
     * @example {js}
     * /**
     *  * Function title
     *  * \@function setColor
     *  *\/
     */
    'function': setFunctionTag,

    /**
     * Describes a parameter for a mixin or a function
     *
     * @group Tags
     * @name @mixin
     * @example {js}
     * /**
     *  * \@mixin foo
     *  * \@param {color} color Background color
     *  *\/
     */
    'param': addParamTag,

    /**
     * Describes a css selector
     *
     * @group Tags
     * @name @selector
     * @example {js}
     * /**
     *  * \@selector selectorName
     *  *\/
     */
    'selector': setFunctionTag
};
