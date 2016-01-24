'use strict';

var setReturnTag = function(tag) {
    var reg = /^(?:\{(.+?)\}\s+)?(.+)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }
    this.defineTag('return', {
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

var setMethodTag = function(tag) {
    var reg = /([a-zA-Z0-9]+)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    this.defineTag(tag.tag, match[1]);
};

var setConstTag = function(tag) {
    var reg = /(?:\{(.+?)\}\s*)?(\[?[a-zA-Z0-9]+\]?\s*)?(.+)?/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    var name = match[2] ? match[2] : this.stripFromSource(/^(?:var|let|const)\s+([a-zA-Z][a-zA-Z0-9$_]*)/);

    this.defineTag(tag.tag, {
        type: match[1],
        name: name,
        description: match[3] || ''
    });
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
};

var setBooleanTag = function(tag) {
    this.defineTag(tag.tag, true);
};

module.exports.parseMethods = {
    'param': setParamTag,
    'method': setMethodTag,
    'class': setMethodTag,
    'const': setConstTag,
    'property': setPropertyTag,
    'constructor': setBooleanTag,
    'return': setReturnTag,
    'returns': setReturnTag
};
