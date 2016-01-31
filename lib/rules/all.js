'use strict';

var addExampleTag = function(tag) {
    var reg = /(?:\{(.+?)\}\s+)?(?:(.+?)\s+)?([^]+)/;
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
    var reg = /(?:\{(.+?)\}\s+)?(?:(.+?)\s+)?([^]+)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    var newTag = {
        type: match[1] || '',
        name: match[2] || '',
        description: match[3] || ''
    };

    this.defineMultiTag('preview', newTag);
};

var addLinkTag = function(tag) {
    var reg = /^(?:(.+)\s+)?(https?:\/\/.+)/;
    var match = reg.exec(tag.value);
    if (!match) {
        return this.addUnknownTag(tag);
    }

    var newTag = {
        name: match[1] || '',
        link: match[2] || ''
    };

    this.defineMultiTag('links', newTag);
};

/**
 * Generic tags, these tags are available in all languages
 * @module Generic
 */
module.exports.parseMethods = {
    /**
     * Define a package or module version
     *
     * @anotation @version
     * @example {js}
     * /**
     *  * @version v0.4.7
     *  *\/
     */
    'version': 'setVersion',
    
    /**
     * Creates a package and groups all folowing anotations to this package
     * 
     * A package can contain a set of subpackages and modules
     * 
     * @anotation @package
     * @example {js}
     * /**
     *  * @version v0.4.7
     *  *\/
     */
    'package': 'setTag',
    
    /**
     * Creates a subpackage and groups all folowing anotations to this subpackage
     * 
     * A subpackage can contain a set of modules
     *
     * @anotation @subpackage
     * @example {js}
     * /**
     *  * @version v0.4.7
     *  *\/
     */
    'subpackage': 'setTag',
    
    /**
     * Creates a module and groups all folowing anotations to this module
     * 
     * A module can contain a set of submodules
     *
     * @anotation @module
     * @example {js}
     * /**
     *  * @module mymodule
     *  *\/
     */
    'module': 'setTag',
    
    /**
     * Creates a submodule and groups all folowing anotations to this submodule
     *
     * @anotation @submodule
     * @example {js}
     * /**
     *  * @module mymodule
     *  * @submodule submodule
     *  *\/
     */
    'submodule': 'setTag',

    /**
     * Creates a new group and passes block to these group
     *
     * @anotation @group
     * @example {js}
     * /**
     *  * @group mygroup
     *  *\/
     */
    'group': 'setTag',

    /**
     * Defines a name for a block
     *
     * @anotation @name
     * @example {js}
     * /**
     *  * @name myname
     *  *\/
     */
    'name': 'setTag',
    
    /**
     * Sets the public flag for a block
     *
     * @anotation @public
     * @example {js}
     * /**
     *  * @public
     *  *\/
     */
    'public': 'setPublic',
    
    /**
     * Sets the protected flag for a block
     *
     * @anotation @protected
     * @example {js}
     * /**
     *  * @protected
     *  *\/
     */
    'protected': 'setProtected',
    
    /**
     * Sets the private flag for a block
     *
     * @anotation @private
     * @example {js}
     * /**
     *  * @private
     *  *\/
     */
    'private': 'setPrivate',
    
    /**
     * Marks a block as unimplemented. Passing a version number is optionally
     *
     * @anotation @unimplemented
     * @example {js}
     * /**
     *  * @unimplemented
     *  *\/
     */
    'unimplemented': 'setTag',
    
    /**
     * Marks a block as beta. Passing a version number is optionally
     *
     * @anotation @beta
     * @example {js}
     * /**
     *  * @beta v0.4.0
     *  *\/
     */
    'beta': 'setTag',
    
    /**
     * Marks a block as new. Passing a version number is optionally
     *
     * @anotation @new
     * @example {js}
     * /**
     *  * @new v0.4.0
     *  *\/
     */
    'new': 'setTag',
    
    /**
     * Marks a block as deprecated. Passing a version number is optionally
     *
     * @anotation @deprecated
     * @example {js}
     * /**
     *  * @deprecated v0.4.0
     *  *\/
     */
    'deprecated': 'setDeprecated',
    
    /**
     * Defines an example block.
     *
     * @anotation @example
     * @example {js}
     * /**
     *  * @example {js}
     *  * var foo = 'Foo';
     *  * console.log(foo);
     *  *\/
     */
    'example': addExampleTag,
    
    /**
     * Defines a preview block. The preview content should be valid html
     *
     * @anotation @preview
     * @preview
     * /**
     *  * @preview
     *  * <div class="colorPreview colorRed">
     *  *   #ff0000
     *  * </div>
     *  *\/
     */
    'preview': addPreviewBlock,

    /**
     * Defines a type for a block
     *
     * @anotation @type
     * @example {js}
     * /**
     *  * @type string
     *  *\/
     */
    'type': 'setTag',

    /**
     * Defines a link to an external resource
     *
     * @anotation @link
     * @example {js}
     * /**
     *  * @link External docu http://example.com
     *  * @link http://doxydoc.com/syntax.html
     *  *\/
     */
    'link': addLinkTag,

    /**
     * Ignores a code block
     *
     * @anotation @ignore
     * @example {js}
     * /**
     *  * @ignore
     *  *\/
     */
    'ignore': 'setTag',
};