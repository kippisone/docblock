'use strict';

var DocBlock = require('../../lib/docBlock');
var inspect = require('inspect.js');

describe('Javascript rules', function() {    
    describe('tags', function() {        
        it('Should parse a @param tags', function() {
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

        it('Should parse a @param tags with optional params', function() {
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

        it('Should parse a @property tag', function() {
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

        it('Should parse a @property tag without description', function() {
            var docArray = [
                { tag: 'property', value: '{object} prop' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    property: {
                        type: 'object',
                        name: 'prop',
                        description: ''
                    }
                }
            });
        });

        it('Should parse a @property tag without description and name', function() {
            var docArray = [
                { tag: 'property', value: '{object}' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    property: {
                        type: 'object',
                        description: ''
                    }
                }
            });
        });

        it('Should parse a @method tag', function() {
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

        it('Should parse a @function tag', function() {
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

        it('Should parse a @class tag', function() {
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

        it('Should parse a @const tag', function() {
            var docArray = [
                { tag: 'const', value: 'FOO' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'const': {
                        name: 'FOO'
                    }
                }
            });
        });

        it('Should parse a @var tag', function() {
            var docArray = [
                { tag: 'var', value: 'FOO' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'var': {
                        name: 'FOO'
                    }
                }
            });
        });

        it('Should parse a @constructor tag', function() {
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

        it('Should parse a @constructor tag, strip function name from source', function() {
            var docArray = [
                { tag: 'constructor', value: '' }
            ];

            var source = [
                'var foo = function Foo() {',
                '',
                '};'].join('\n');

            var docBlock = new DocBlock('js');
            docBlock.setSourceCode('js', source);
            docBlock = docBlock.create(docArray);

            inspect(docBlock).hasProps({
                tags: {
                    'constructor': 'Foo'
                }
            });
        });

        it('Should parse a @return tag', function() {
            var docArray = [
                { tag: 'return', value: '{object} Returns foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'returns': {
                        type: 'object',
                        description: 'Returns foo'
                    }
                }
            });
        });

        it('Should parse a @returns tag', function() {
            var docArray = [
                { tag: 'returns', value: '{object} Returns foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'returns': {
                        type: 'object',
                        description: 'Returns foo'
                    }
                }
            });
        });

        it('Should parse a @default tag', function() {
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

        it('Should parse an @event tag', function() {
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

        it('Should parse a @fires tag', function() {
            var docArray = [
                { tag: 'fires', value: 'foo.bar' },
                { tag: 'param', value: '{object} foo Foo object' },
                { tag: 'param', value: '{boolean} isBar Is bar?' },
                { tag: 'param', value: '{string} [msg] Optional message' }
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

        it('Should parse a @mixin tag', function() {
            var docArray = [
                { tag: 'mixin', value: 'foo' },
                { tag: 'param', value: '{object} req Express req object'},
                { tag: 'param', value: '{object} res Express res object'}
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    mixin: 'foo',
                    params: [{
                        name: 'req',
                        object: 'object',
                        description: 'Express req object'
                    }, {
                        name: 'res',
                        object: 'object',
                        description: 'Express res object'
                    }]
                }
            });
        });

        it('Should parse a @middleware tag', function() {
            var docArray = [
                { tag: 'middleware', value: 'foo' },
                { tag: 'param', value: '{object} req Express req object'},
                { tag: 'param', value: '{object} res Express res object'}
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    middleware: 'foo',
                    params: [{
                        name: 'req',
                        object: 'object',
                        description: 'Express req object'
                    }, {
                        name: 'res',
                        object: 'object',
                        description: 'Express res object'
                    }]
                }
            });
        });

        it('Should parse a @callback tag', function() {
            var docArray = [
                { tag: 'callback', value: 'foo' },
                { tag: 'param', value: '{object} req Express req object'},
                { tag: 'param', value: '{object} res Express res object'}
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    callback: 'foo',
                    params: [{
                        name: 'req',
                        object: 'object',
                        description: 'Express req object'
                    }, {
                        name: 'res',
                        object: 'object',
                        description: 'Express res object'
                    }]
                }
            });
        });

        it('Should parse an @async tag', function() {
            var docArray = [
                { tag: 'async', value: ''}
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    async: true
                }
            });
        });

        it('Should parse a @static tag', function() {
            var docArray = [
                { tag: 'static', value: ''}
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    static: true
                }
            });
        });
    });
});