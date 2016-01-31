'use strict';

var DocBlockParser = require('../lib/docBlockParser');
var inspect = require('inspect.js');
var fl = require('node-fl');

describe('Dockblock parser', function() {
    describe('stripBlockLines', function() {
        it('Should strip lines from a DocBlock', function() {
            var block = [
                ' * Test block',
                ' * ',
                ' * @module testmodule',
                ' * @param {object} foo Foo is footastic',
                ' *',
                ' * @public',
                ' *'
            ].join('\n');

            var docblock = new DocBlockParser();
            var lines = docblock.stripBlockLines(block);
            
            inspect(lines).isEql([
                ' Test block',
                ' ',
                ' @module testmodule',
                ' @param {object} foo Foo is footastic',
                '',
                ' @public',
                ''
            ]);
        });
    });

    describe.skip('stripSource (obsolete)', function() {
        it('Should strip soucecode', function() {
            var docBlock = new DocBlockParser();
            var source = fl.read(__dirname + '/fixtures/banana.js');
            docBlock.source = source;
            var code = docBlock.stripSource(162);

            inspect.print(code);

            inspect(code)
                .doesStartWith('module.exports = function() {')
                .doesEndWith('};');
        });
    });

    describe('getLine', function() {
        it('Should strip soucecode', function() {
            var docBlock = new DocBlockParser();
            var source = fl.read(__dirname + '/fixtures/banana.js');
            docBlock.source = source;
            var line = docBlock.getLine(162);

            inspect(line).isEql(11);
        });
    });

    describe('parseTags', function() {
        it('Should strip lines from a DocBlock', function() {
            var block = [
                ' * Test block',
                ' * ',
                ' * With description',
                ' * as second block',
                ' * @module testmodule',
                ' * @param {object} foo Foo is footastic',
                ' *',
                ' * @public',
                ' *'
            ].join('\n');

            var docblock = new DocBlockParser();
            var lines = docblock.parseTags(block);
            
            inspect(lines).isEql([
                { tag: 'title', value: 'Test block' },
                { tag: 'description', value: 'With description\nas second block' },
                { tag: 'module', value: 'testmodule' },
                { tag: 'param', value: '{object} foo Foo is footastic' },
                { tag: 'public', value: '' }
            ]);
        });
    });

    describe('parse', function() {
        var docblock;
        var result;

        beforeEach(function() {
            docblock = new DocBlockParser();
            result = docblock.parse(fl.read(__dirname + '/fixtures/banana.js'), 'js');
                
        });

        it('Should parse @module from banana.js', function() {
            inspect(result[0]).hasProps({
                title: 'Banana test module',
                description: 'Very awesome banana module.',
                tags: {
                    module: 'banana',
                    examples: [
                        {
                            content: '    var banana = require(\'banana\');\n    banana.peelIt();'
                        }
                    ]
                },
                pos: 161,
                raw: [
                    '/**',
                    ' * Banana test module',
                    ' *',
                    ' * Very awesome banana module.',
                    ' * ',
                    ' * @module  banana',
                    ' * @example',
                    ' *     var banana = require(\'banana\');',
                    ' *     banana.peelIt();',
                    ' */'
                ].join('\n')
            });
        });

        it('Should parse @const from banana.js', function() {
            inspect(result[1]).hasProps({
                title: 'Test constant',
                description: '',
                tags: {
                    const: {
                        type: 'string',
                        name: 'NAME',
                        description: ''
                    }
                },
                pos: 274,
                raw: [
                    '/**',
                    '     * Test constant',
                    '     * @const {string}',
                    '     */'
                ].join('\n')
            });
        });

        it('Should parse @constructor from banana.js', function() {
            inspect(result[2]).hasProps({
                title: 'Banana constructor',
                description: '',
                tags: {
                    constructor: 'Banana'
                },
                pos: 362,
                raw: [
                    '/**',
                    '     * Banana constructor',
                    '     * @constructor',
                    '     */'
                ].join('\n')
            });
        });

        it('Should parse @return from banana.js', function() {
            inspect(result[3]).hasProps({
                title: 'Tastes method of Banana',
                description: '',
                tags: {
                    'returns': {
                        type: 'string',
                        description: 'Returns how bananas tastes'
                    }
                },
                pos: 507,
                raw: [
                    '/**',
                    '     * Tastes method of Banana',
                    '     * ',
                    '     * @return {string} Returns how bananas tastes',
                    '     */'
                ].join('\n')
            });
        });
    });
});
