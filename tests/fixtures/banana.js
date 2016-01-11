/**
 * Banana test module
 *
 * Very awesome banana module.
 * 
 * @module  banana
 * @example
 *     var banana = require('banana');
 *     banana.peelIt();
 */
module.exports = function() {
    'use strict';
    
    /**
     * Test constant
     * @const {string}
     */
    var NAME = 'banana';

    /**
     * Banana constructor
     * @constructor
     */
    var Banana = function() {

    };

    /**
     * Tastes method of Banana
     * 
     * @return {string} Returns how bananas tastes
     */
    Banana.prototype.tastes = function() {
        return 'awesome';
    };

    /**
     * Private method
     *
     * @private
     * @param {boolean} isGreen Returns true if banana is green
     * @param {function} callback Callback function
     * @returns {object} Returns this property
     */
    Banana.prototype.isGreen = function(green) {
        
    };

    /**
     * Is sweet property
     *
     * @property {boolean} isSweet
     */
    Banana.prototype.isSweet = false;

    /**
     * Protected method
     *
     * @protected
     */
    Banana.prototype.isProtected = function() {

    };

    /**
     * Private method
     *
     * @private
     */
    Banana.prototype.isPrivate = function() {

    };

    /**
     * Deprecated method
     *
     * @deprecated
     */
    Banana.prototype.isDeprecated = function() {

    };

    /**
     * Deprecated since method
     *
     * @deprecated v0.3.0
     */
    Banana.prototype.isDeprecated = function() {

    };

    /**
     * Unimplemented method
     * @unimplemented
     */
    Banana.prototype.isUnimplemented = function() {

    };

    /**
     * Add new banana
     * @fires banana.add Fires a banana.add event
     * @fires banana.change Fires a banana.change event
     */
    Banana.prototype.addBanana = function() {

    };

    /**
     * Register listener
     * @event banana.add Registers an add listener
     * @event banana.change Registers a change listener
     */
    Banana.prototype.registerListener = function() {
        
    };

    /**
     * Has links
     * 
     * @link Syntax http://doxydoc.com/syntax/syntax.html
     * @link Jump to top #top
     */
    Banana.prototype.hasLinks = function() {
        
    };

    /**
     * Show a preview
     * @preview {html}
     * <button>
     *   Click me!
     * </button>
     */
    Banana.prototype.showPreview = function() {
        
    };

    //--
};

// end of banana
