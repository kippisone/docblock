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

        it('Should parse @function tag', function() {
            var docArray = [
                { tag: 'function', value: 'foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'function': 'foo'
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

        it.skip('Should parse @const tag', function() {
            var docArray = [
                { tag: 'const', value: 'FOO' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'const': 'FOO'
                }
            });
        });

        it('Should parse @constructor tag', function() {
            var docArray = [
                { tag: 'constructor', value: 'Foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'constructor': 'Foo'
                }
            });
        });

        it('Should parse @return tag', function() {
            var docArray = [
                { tag: 'return', value: '{object} Returns foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'return': {
                        type: 'object',
                        description: 'Returns foo'
                    }
                }
            });
        });

        it('Should parse @returns tag', function() {
            var docArray = [
                { tag: 'returns', value: '{object} Returns foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'return': {
                        type: 'object',
                        description: 'Returns foo'
                    }
                }
            });
        });

        it('Should parse @default tag', function() {
            var docArray = [
                { tag: 'default', value: '{object} Returns foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'default': {
                        type: 'object',
                        description: 'Returns foo'
                    }
                }
            });
        });

        it('Should parse @event tag', function() {
            var docArray = [
                { tag: 'event', value: 'foo.bar' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'event': {
                        name: 'foo.bar'
                    }
                }
            });
        });

        it('Should parse @fires tag', function() {
            var docArray = [
                { tag: 'fires', value: 'foo.bar' },
                { tag: 'arg', value: '{object} foo Foo object' },
                { tag: 'arg', value: '{boolean} isBar Is bar?' },
                { tag: 'arg', value: '{string} [msg] Optional message' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock.tags.fires).isArray();
            inspect(docBlock).hasProps({
                tags: {
                    'fires': [{
                        'event': 'foo.bar',
                        args: [
                            { type: 'object', name: 'foo', description: 'Foo object' },
                            { type: 'boolean', name: 'isBar', description: 'Is bar?' },
                            { type: 'string', optional: true, name: 'msg', description: 'Optional message' }
                        ]
                    }]
                }
            });
        });
    });
});

