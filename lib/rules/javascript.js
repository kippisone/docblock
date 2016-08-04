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

  var name = match[2] || '';

  if (name.charAt(0) === '[' && name.charAt(name.length - 1) === ']') {
    newTag.optional = true;
    name = name.slice(1, -1).split('=');
    if (name.length === 2) {
      newTag.default = name[1];
    }

    newTag.name = name[0];
  }

  this.defineMultiTag(tag.tag + 's', newTag);
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

var setApiTag = function(tag) {
  var reg = /(?:([a-zA-Z-]+)\s*)?(.+)?/;
  var match = reg.exec(tag.value);
  if (!match) {
    return this.addUnknownTag(tag);
  }

  this.defineTag(tag.tag, {
    type: match[1],
    path: match[2]
  });

  this.setGroup(tag.tag);
  this.setName(match[1]);
};

var setResponseTag = function(tag) {
  var reg = /(?:(\d+)\s+)?(?:([a-zA-Z\/+.-]+)\s*)?(.+)?([^]+)?/;
  var match = reg.exec(tag.value);
  if (!match) {
    return this.addUnknownTag(tag);
  }

  var content = match[4] ? match[4].trim() : '';
  this.defineMultiTag(tag.tag + 's', {
    status: match[1],
    type: match[2],
    name: match[3],
    content: content
  });

  this.setGroup(tag.tag);
  this.setName(match[1]);
};

var setHeaderTag = function(tag) {
  var reg = /(?:\{(.+?)\}\s+)?(?:(\[?[a-zA-Z0-9$-_]+\]?)\s+)?(.+)/;
  var match = reg.exec(tag.value);
  if (!match) {
    return this.addUnknownTag(tag);
  }

  var newTag = {
    type: match[1] || '',
    name: match[2] || '',
    description: match[3] || ''
  };

  var name = match[2] || '';

  if (name.charAt(0) === '[' && name.charAt(name.length - 1) === ']') {
    newTag.optional = true;
    name = name.slice(1, -1).split('=');
    if (name.length === 2) {
      newTag.default = name[1];
    }

    newTag.name = name[0];
  }

  this.defineMultiTag(tag.tag + 's', newTag);
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
   *  * \@method foo
   *  * \@param {object} obj Foo object
   *  * \@param {bool} [silent] Optional silent property
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
   *  * \@property {object} obj
   *  *\/
   */
  'property': setPropertyTag,

  /**
   * Describes a method
   *
   * @group Tags
   * @name @method
   * @example {js}
   *  class MyClass {
   *  	/**
   *     * Method foo
   *     * \@method foo
   *     *\/
   *    foo() {
   *      // some code
   *    }
   *  }
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
   *  * \@mixin requestLogger
   *  * \@param {object} req Express req object
   *  * \@param {object} res Express res object
   *  * \@param {function} next Next callback
   *  *\/
   */
  'mixin': setMethodTag,

  /**
   * Describes a class
   *
   * @group Tags
   * @name @class
   * @example {js}
   * /**
   *  * My fancy class
   *  * \@class MyClass
   *  *\/
   *  class MyClass {
   *    // class code
   *  }
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
   *  * \@const {string} SERVER_PORT
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
   *  * \@var {boolean} isFoo
   *  *\/
   */
  'var': setConstTag,

  /**
   * Describes a class constructor
   *
   * @group Tags
   * @name @constructor
   * @example {js}
   * /**
   *  * Class constructor
   *  * \@constructor
   *  *\/
   *  function MyCalss() {
   *    // some code
   *  }
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
   *  * \@method foo
   *  * \@returns {object} Returns a promise
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
   *  * \@returnValue {promise}
   *  * \@arg {object} Then arg is a http response object
   *  * \@err {object} Catch arg contains an error object
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
   *  * \@fire foo.bar
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
   *  * \@fires server.ready
   *  * \@arg {object} err Server error or null
   *  * \@arg {object} res Express response object
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
   *  * \@returnValue {promise}
   *  * \@arg {object} res Express response object
   *  * \@err {object} err Server error or null
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
   *  * \@async
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
   *  * \@chainable
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
   *  * \@callback done
   *  * \@param {object} err Server error or null
   *  * \@param {object} res Express response object
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
   *  * \@mixin requestLogger
   *  * \@param {object} req Express req object
   *  * \@param {object} res Express res object
   *  * \@param {function} next Next callback
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
   *  * \@fires server.ready
   *  * \@arg {object} err Server error or null
   *  * \@arg {object} res Express response object
   *  *\/
   */
  'static': 'setFlag',

  /**
   * Describes an api call
   *
   * @group Tags
   * @name @api
   * @example {js}
   * /**
   *  * \@api GET /api/info
   *  *\/
   */
  'api': setApiTag,

  /**
   * Describes an api response
   *
   * @group Tags
   * @name @response
   * @example {js}
   * /**
   *  * \@response 200 application/json OK
   *  * {
   *  * 	 "version": "1.5.3",
   *  *    "status": "online"
   *  * }
   *  *\/
   */
  'response': setResponseTag,

  /**
   * Describes an api header
   *
   * @group Tags
   * @name @header
   * @example {js}
   * /**
   *  * \@header {string} content-type Defines the content type
   *  * {
   *  * 	 "version": "1.5.3",
   *  *    "status": "online"
   *  * }
   *  *\/
   */
  'header': setHeaderTag,

  /**
   * Describes an api cookie
   *
   * @group Tags
   * @name @cookie
   * @example {js}
   * /**
   *  * \@cookie {string} name Defines the content type
   *  * {
   *  * 	 "version": "1.5.3",
   *  *    "status": "online"
   *  * }
   *  *\/
   */
  'cookie': setHeaderTag
};
