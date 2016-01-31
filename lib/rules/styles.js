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


/**
 * Style tags, can be used to describe your CSS, LESS, Stylus, SCSS or SASS files
 * 
 * @module Styles
 */
module.exports.parseMethods = {
    /**
     * Describes a variable
     *
     * @anotation @var
     * @example {js}
     * /**
     *  * Variable title
     *  * @variable {string} foo
     *  *\/
     */
    'var': 'setTag',

    /**
     * Describes a mixin
     *
     * @anotation @mixin
     * @example {js}
     * /**
     *  * Mixin title
     *  * @mixin fooMixin
     *  *\/
     */
    'mixin': 'setTag',

    /**
     * Describes a function
     *
     * @anotation @function
     * @example {js}
     * /**
     *  * Function title
     *  * @function setColor
     *  *\/
     */
    'function': 'setTag',

    /**
     * Describes a parameter for a mixin or a function
     *
     * @anotation @mixin
     * @example {js}
     * /**
     *  * @mixin foo
     *  * @param {color} color Background color
     *  *\/
     */
    'param': addParamTag,

    /**
     * Describes a css selector
     *
     * @anotation @selector
     * @example {js}
     * /**
     *  * @selector selectorName
     *  *\/
     */
    'selector': 'setTag'
};
