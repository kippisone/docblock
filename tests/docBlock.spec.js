'use strict';

var DocBlock = require('../lib/docBlock');
var inspect = require('inspect.js');

describe('DocBlock', function() {
    
    describe('create', function() {
        it('Should create a DocBlock from a DocArray', function() {
            var docArray = [
                { tag: 'title', value: 'Test block' },
                { tag: 'description', value: '' },
                { tag: 'module', value: 'testmodule' },
                { tag: 'param', value: '{object} foo Foo is footastic' },
                { tag: 'public', value: '' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                title: 'Test block',
                description: '',
                tags: {
                    module: 'testmodule',
                    params: [
                        {
                            type: 'object',
                            name: 'foo',
                            description: 'Foo is footastic'
                        }
                    ],
                    isPublic: true,
                    isProtected: false,
                    isPrivate: false,
                    isDeprecated: false,
                    ignore: false
                }
            });
        });

        it('Should create a module DocBlock', function() {
            var docArray = [
                { tag: 'title', value: 'Banana test module' },
                { tag: 'description', value: 'Very awesome banana module.' },
                { tag: 'module', value: 'banana' },
                { tag: 'example', value: '    var banana = require(\'banana\');\n    banana.peelIt();' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                title: 'Banana test module',
                description: 'Very awesome banana module.',
                tags: {
                    module: 'banana',
                    examples: [
                        {
                            content: '    var banana = require(\'banana\');\n    banana.peelIt();'
                        }
                    ],
                    isPublic: false,
                    isProtected: false,
                    isPrivate: false,
                    isDeprecated: false,
                    ignore: false
                }
            });
        });

        it('Should parse @param tags', function() {
            var docArray = [
                { tag: 'param', value: '{object|array} obj Input object' },
                { tag: 'param', value: '{string}    str      Any string' },
                { tag: 'param', value: '{boolean} bool Must be a boolean' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    params: [
                        { name: 'obj', type: 'object|array', description: 'Input object' },
                        { name: 'str', type: 'string', description: 'Any string' },
                        { name: 'bool', type: 'boolean', description: 'Must be a boolean' }
                    ]
                }
            });
        });

        it('Should parse @param tags with optional params', function() {
            var docArray = [
                { tag: 'param', value: '{object|array} obj Input object' },
                { tag: 'param', value: '{string}    [str]      Any string' },
                { tag: 'param', value: '{boolean} [bool=true] Must be a boolean' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    params: [
                        { name: 'obj', type: 'object|array', description: 'Input object' },
                        { name: 'str', type: 'string', description: 'Any string', optional: true },
                        { name: 'bool', type: 'boolean', description: 'Must be a boolean', optional: true, default: 'true' }
                    ]
                }
            });
        });

        it('Should parse @property tag', function() {
            var docArray = [
                { tag: 'property', value: '{object} prop Property description' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    property: {
                        type: 'object',
                        name: 'prop',
                        description: 'Property description'
                    }
                }
            });
        });

        it('Should parse @method tag', function() {
            var docArray = [
                { tag: 'method', value: 'foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    method: 'foo'
                }
            });
        });

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
    });
});

