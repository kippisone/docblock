/**
 * Banana test module
 * @module Banana
 */
module.exports = function() {
    /**
     * Banana constructor
     *
     * Creates a banana instance
     *
     * @constructor
     */
    var Banana = function() {

    }

    /**
     * Peels a banana
     *
     * This method peels a banana and calls a callback
     *
     * @method peelIt
     * @chainable
     * @param {string} startPoint Sets the peeling start point.
     * @param {function} [callback] Callback function
     * @returns {object} Returns this value
     */
    Banana.prototype.peelIt = function(startPoint, callback) {
        return this;
    }

    /**
     * Returns a banana color
     * @return {string} Returns color of a banana
     */
    Banana.prototype.getColor = function () {
        return 'yellow';
    };
}
