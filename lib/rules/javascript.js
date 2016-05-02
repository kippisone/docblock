'use strict';

var pattern = {
    classOrFuncName: /^(?:(?:var|let|const)\s+)?(?:[a-zA-Z0-9]\.)?(?:([a-zA-Z][a-zA-Z0-9_$]*)\s*=\s*)?(?:class|function)(?:\s+([a-zA-Z][a-zA-Z0-9$_]*))?/
}

var setReturnTag = function(tag) {
    var reg = /^(?:\{(.+?)\}\s+)?(.+)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }
    this.defineTag('returns', {
        type: match[1],
        description: match[2]
    });
};

var setParamTag = function(tag) {
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

var setArgTag = function(tag) {
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

    var name = match[2];

    if (name.charAt(0) === '[' && name.charAt(name.length - 1) === ']') {
        newTag.optional = true;
        name = name.slice(1, -1).split('=');
        if (name.length === 2) {
            newTag.default = name[1];
        }

        newTag.name = name[0];
    }

    this.defineMultiSubTag(tag.tag + 's', newTag);
};

var setMethodTag = function(tag) {
    var reg = /([a-zA-Z0-9]+)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    this.defineTag(tag.tag, match[1]);
    this.setGroup(tag.tag);
    this.setName(match[1]);
};

var setReturnValueTag = function(tag) {
    var reg = /(?:\{(.+?)\}\s*)?(.+)?/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    this.defineTag(tag.tag, {
        type: match[1],
        description: match[2] || ''
    });

    this.setGroup(tag.tag);
    this.setName(match[1]);
};

var setConstructorTag = function(tag) {
    var reg = /([a-zA-Z0-9]+)/;
    var match = reg.exec(tag.value);

    var name = tag.value || true;
    if (name === true) {
        match = this.matchSource(pattern.classOrFuncName);
        if (match) {
            name = match[2] || match[1];
        }
    }

    this.defineTag(tag.tag, name);
    this.setGroup(tag.tag);
    this.setName(name);
};

var setConstTag = function(tag) {
    var reg = /(?:\{(.+?)\}\s*)?(\[?[a-zA-Z0-9]+\]?\s*)?(.+)?/;
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

var setPropertyTag = function(tag) {
    var reg = /(?:\{(.+?)\}\s*)?(?:(\[?[a-zA-Z0-9]+\]?)\s*)?(.+)?/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    var name = match[2];

    this.defineTag(tag.tag, {
        type: match[1],
        name: name,
        description: match[3] || ''
    });

    this.setGroup(tag.tag);
    this.setName(name);
};

var setEventTag = function(tag) {
    var reg = /(\[?[a-zA-Z0-9.:_-]+\]?)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    this.defineTag(tag.tag, {
        name: match[1]
    });

    this.setGroup(tag.tag);
    this.setName(match[1]);
};

var setFiresTag = function(tag) {
    var reg = /(\[?[a-zA-Z0-9.:_-]+\]?)(?:\s+(.+))?/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    this.defineMultiTag(tag.tag, {
        'event': match[1],
        description: match[2] || ''
    });
};

/**
 * Javascript specific tags
 * @module Javascript
 */
module.exports.parseMethods = {
    'title': 'setTitle',
    'description': 'setDescription',

    /**
     * Descripes function or method params
     *
     * @group Tags
     * @name @param
     * @example {js}
     * /**
     *  * {@}method foo
     *  * {@}param {object} obj Foo object
     *  * {@}param {bool} [silent] Optional silent property
     *  *\/
     */
    'param': setParamTag,

    /**
     * Descripes a property
     *
     * @group Tags
     * @name @property
     * @example {js}
     * /**
     *  * My property
     *  * {@}property {object} obj
     *  *\/
     */
    'property': setPropertyTag,

    /**
     * TODO
     *
     * @group Tags
     * @name @method
     * @example {js}
     * /**
     *  *
     *  *\/
     */
    'method': setMethodTag,

    /**
     * TODO
     *
     * @group Tags
     * @name @function
     * @example {js}
     * /**
     *  *
     *  *\/
     */
    'function': setMethodTag,

    /**
     * Describes a mixin
     *
     * @group Tags
     * @name @mixin
     * @example {js}
     * /**
     *  * Loggs api requests
     *  * {@}mixin requestLogger
     *  * {@}param {object} req Express req object
     *  * {@}param {object} res Express res object
     *  * {@}param {function} next Next callback
     *  *\/
     */
    'mixin': setMethodTag,

    /**
     * TODO
     *
     * @group Tags
     * @name @class
     * @example {js}
     * /**
     *  *
     *  *\/
     */
    'class': setMethodTag,

    /**
     * Describes a constant
     *
     * @group Tags
     * @name @const
     * @example {js}
     * /**
     *  * Constant title
     *  * {@}const {string} SERVER_PORT
     *  *\/
     */
    'const': setConstTag,

    /**
     * Describes a variable
     *
     * @group Tags
     * @name @var
     * @example {js}
     * /**
     *  * Variable title
     *  * {@}var {boolean} isFoo
     *  *\/
     */
    'var': setConstTag,

    /**
     * TODO
     *
     * @group Tags
     * @name @constructor
     * @example {js}
     * /**
     *  *
     *  *\/
     */
    'constructor': setConstructorTag,

    /**
     * See returns tag
     *
     * @group Tags
     * @name @return
     * @alias returns
     */
    'return': setReturnTag,

    /**
     * Describes a return value of a method or function
     *
     * @group Tags
     * @name @returns
     * @example {js}
     * /**
     *  * {@}method foo
     *  * {@}returns {object} Returns a promise
     *  *\/
     */
    'returns': setReturnTag,

    /**
     * Detailed description of a return value
     *
     * @group Tags
     * @name @returnValue
     * @example {js}
     * /**
     *  * {@}returnValue {promise}
     *  * {@}arg {object} Then arg is a http response object
     *  * {@}err {object} Catch arg contains an error object
     *  *\/
     */
    'returnValue': setReturnValueTag,

    /**
     * TODO
     *
     * @group Tags
     * @name @default
     * @example {js}
     * /**
     *  *
     *  *\/
     */
    'default': 'setTag',

    /**
     * Describes an event that can be triggered
     *
     * @group Tags
     * @name @event
     * @example {js}
     * /**
     *  *
     *  *\/
     */
    'event': setEventTag,

    /**
     * Describes events that a function or method triggers
     *
     * See also @arg
     *
     * @group Tags
     * @name @fires
     * @example {js}
     * /**
     *  * {@}fire foo.bar
     *  *\/
     */
    'fires': setFiresTag,

    /**
     * Describes the arguments for a event call
     *
     * @group Tags
     * @name @arg
     * @example {js}
     * /**
     *  * {@}fires server.ready
     *  * {@}arg {object} err Server error or null
     *  * {@}arg {object} res Express response object
     *  *\/
     */
    'arg': setArgTag,

    /**
     * Describes an error argument for an event or function call
     *
     * @group Tags
     * @name @arg
     * @example {js}
     * /**
     *  * {@}returnValue {promise}
     *  * {@}arg {object} res Express response object
     *  * {@}err {object} err Server error or null
     *  *\/
     */
    'err': setArgTag,

    /**
     * Marks a block as asyncron
     *
     * @group Tags
     * @name @async
     * @example {js}
     * /**
     *  * {@}async
     *  *\/
     */
    'async': 'setFlag',

    /**
     * Marks a block as chainable
     *
     * @group Tags
     * @name @chainable
     * @example {js}
     * /**
     *  * {@}chainable
     *  *\/
     */
    'chainable': 'setFlag',

    /**
     * Describes a callback function
     *
     * @group Tags
     * @name @callback
     * @example {js}
     * /**
     *  * {@}callback done
     *  * {@}param {object} err Server error or null
     *  * {@}param {object} res Express response object
     *  *\/
     */
    'callback': setMethodTag,

    /**
     * Describes a middleware function
     *
     * @group Tags
     * @name @middleware
     * @example {js}
     * /**
     *  * Loggs api requests
     *  * {@}mixin requestLogger
     *  * {@}param {object} req Express req object
     *  * {@}param {object} res Express res object
     *  * {@}param {function} next Next callback
     *  *\/
     */
    'middleware': setMethodTag,

    /**
     * Describes the arguments for a event call
     *
     * @group Tags
     * @name @arg
     * @example {js}
     * /**
     *  * {@}fires server.ready
     *  * {@}arg {object} err Server error or null
     *  * {@}arg {object} res Express response object
     *  *\/
     */
    'static': 'setFlag'
};
