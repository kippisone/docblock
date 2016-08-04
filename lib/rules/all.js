'use strict';

var addExampleTag = function(tag) {
    var reg = /(?:\{(.+?)\})?(?:(.+))?(\n[^]+)/;
    var match = reg.exec(tag.value);

    if (!match) {
        return this.addUnknownTag(tag);
    }

    this.defineMultiTag('examples', {
        type: match[1] || '',
        title: match[2] || '',
        content: match[3]
    });
};

var addPreviewBlock = function(tag) {
    var split = tag.value.split('\n');
    var reg = /(?:\{(.+?)\}\s*)?(?:(.+)\s+)?/;
    var html;
    var match;

    if (split.length) {
        match = reg.exec(split[0]);
        split.shift();
        html = split.join('\n');
    }

    if (!match) {
        return this.addUnknownTag(tag);
    }

    var newTag = {
        type: match[1] || 'html',
        name: match[2] || '',
        html: html
    };

    this.defineMultiTag('previews', newTag);
};

var addLinkTag = function(tag) {
    var reg = /^(?:(.+)\s+)?(https?:\/\/.+)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    var newTag = {
        name: match[1] || match[2],
        link: match[2]
    };

    this.defineMultiTag('links', newTag);
};

var setGroupTag = function(tag) {
    this.setGroup(tag.value);
};

var setNameTag = function(tag) {
    this.setName(tag.value);
};

/**
 * Generic tags, these tags are available in all languages
 * @module Generic
 */
module.exports.parseMethods = {
    /**
     * Define a package or module version
     *
     * @group Tags
     * @name @version
     */
    'version': 'setVersion',

    /**
     * Creates a package and groups all folowing anotations to this package
     *
     * A package can contain a set of subpackages and modules
     *
     * @group Tags
     * @name @package
     */
    'package': 'setTag',

    /**
     * Creates a subpackage and groups all folowing anotations to this subpackage
     *
     * A subpackage can contain a set of modules
     *
     * @group Tags
     * @name @subpackage
     * @example {js}
     * /**
     *  * \@version v0.4.7
     *  *\/
     */
    'subpackage': 'setTag',

    /**
     * Creates a module and groups all folowing anotations to this module
     *
     * A module can contain a set of submodules
     *
     * @group Tags
     * @name @module
     * @example {js}
     * /**
     *  * \@module mymodule
     *  *\/
     */
    'module': 'setTag',

    /**
     * Creates a submodule and groups all folowing anotations to this submodule
     *
     * @group Tags
     * @name @submodule
     * @example {js}
     * /**
     *  * \@module mymodule
     *  * \@submodule submodule
     *  *\/
     */
    'submodule': 'setTag',

    /**
     * Creates a new group and passes block to these group
     *
     * @group Tags
     * @name @group
     * @example {js}
     * /**
     *  * \@group mygroup
     *  *\/
     */
    'group': setGroupTag,

    /**
     * Defines a name for a block
     *
     * @group Tags
     * @name @name
     * @example {js}
     * /**
     *  * \@name myname
     *  *\/
     */
    'name': setNameTag,

    /**
     * Sets the public flag for a block
     *
     * @group Tags
     * @name @public
     * @example {js}
     * /**
     *  * \@public
     *  *\/
     */
    'public': 'setPublic',

    /**
     * Sets the protected flag for a block
     *
     * @group Tags
     * @name @protected
     * @example {js}
     * /**
     *  * \@protected
     *  *\/
     */
    'protected': 'setProtected',

    /**
     * Sets the private flag for a block
     *
     * @group Tags
     * @name @private
     * @example {js}
     * /**
     *  * \@private
     *  *\/
     */
    'private': 'setPrivate',

    /**
     * Marks a block as unimplemented. Passing a version number is optionally
     *
     * @group Tags
     * @name @unimplemented
     * @example {js}
     * /**
     *  * \@unimplemented
     *  *\/
     */
    'unimplemented': 'setFlag',

    /**
     * Marks a block as beta. Passing a version number is optionally
     *
     * @group Tags
     * @name @beta
     * @example {js}
     * /**
     *  * \@beta v0.4.0
     *  *\/
     */
    'beta': 'setFlag',

    /**
     * Marks a block as new. Passing a version number is optionally
     *
     * @group Tags
     * @name @new
     * @example {js}
     * /**
     *  * \@new v0.4.0
     *  *\/
     */
    'new': 'setFlag',

    /**
     * Marks a block as deprecated. Passing a version number is optionally
     *
     * @group Tags
     * @name @deprecated
     * @example {js}
     * /**
     *  * \@deprecated v0.4.0
     *  *\/
     */
    'deprecated': 'setDeprecated',

    /**
     * Defines an example block.
     *
     * @group Tags
     * @name @example
     * @example {js}
     * /**
     *  * \@example {js}
     *  * var foo = 'Foo';
     *  * console.log(foo);
     *  *\/
     */
    'example': addExampleTag,

    /**
     * Defines a preview block. The preview content should be valid html
     *
     * @group Tags
     * @name @preview
     * @example
     * /**
     *  * \@preview
     *  * &lt;div class="colorPreview colorRed"&gt;
     *  *   #ff0000
     *  * &lt;/div&gt;
     *  *\/
     */
    'preview': addPreviewBlock,

    /**
     * Defines a type for a block
     *
     * @group Tags
     * @name @type
     * @example {js}
     * /**
     *  * \@type string
     *  *\/
     */
    'type': 'setTag',

    /**
     * Defines a link to an external resource
     *
     * @group Tags
     * @name @link
     * @example {js}
     * /**
     *  * \@link External docu http://example.com
     *  * \@link http://doxydoc.com/syntax.html
     *  *\/
     */
    'link': addLinkTag,

    /**
     * Ignores a code block
     *
     * @group Tags
     * @name @ignore
     * @example {js}
     * /**
     *  * \@ignore
     *  *\/
     */
    'ignore': 'setTag'
};
