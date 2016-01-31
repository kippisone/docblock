'use strict';

var DocBlock = require('../../lib/docBlock');
var inspect = require('inspect.js');

describe('Style rules', function() {    
    describe('tags', function() {        
        it('Should parse @class tag', function() {
            var docArray = [
                { tag: 'class', value: 'foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'class': 'foo'
                }
            });
        });

        it('Should parse @var tag', function() {
            var docArray = [
                { tag: 'var', value: '{string} FOO' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'var': {
                        name: 'FOO',
                        type: 'string'
                    }
                }
            });
        });

        it('Should parse @mixin tag', function() {
            var docArray = [
                { tag: 'mixin', value: 'foo' },
                { tag: 'param', value: '{color} color1 Font color'},
                { tag: 'param', value: '{color} color2 Background color'}
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    mixin: 'foo',
                    params: [{
                        name: 'color1',
                        object: 'color',
                        description: 'Font color'
                    }, {
                        name: 'color2',
                        object: 'color',
                        description: 'Background color'
                    }]
                }
            });
        });

        it('Should parse @function tag', function() {
            var docArray = [
                { tag: 'function', value: 'foo' },
                { tag: 'param', value: '{color} color1 Font color'},
                { tag: 'param', value: '{color} color2 Background color'}
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'function': 'foo',
                    params: [{
                        name: 'color1',
                        object: 'color',
                        description: 'Font color'
                    }, {
                        name: 'color2',
                        object: 'color',
                        description: 'Background color'
                    }]
                }
            });
        });
    });
});
