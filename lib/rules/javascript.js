'use strict';

module.exports = {

    /**
     * Matches a constant. First capture matches the constant name
     * 
     * @property {regexp} const
     * @return {string} Returns a matched constant name
     */
    'const': /^(?:var|let|const)\s+([a-zA-Z][a-zA-Z0-9$_]+)/
};