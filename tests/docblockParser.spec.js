'use strict';

var DocBlockParser = require('../lib/docBlockParser');
var inspect = require('coffeebreak-inspect');
var fl = require('node-fl');
var expect = require('expect.js');

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
            
            expect(lines).to.eql([
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

    describe('stripSource', function() {
        it('Should strip soucecode', function() {
            var docBlock = new DocBlockParser();
            var source = fl.read(__dirname + '/fixtures/banana.js');
            docBlock.source = source;
            var code = docBlock.stripSource(162);

            inspect(code)
                .toStartsWith('module.exports = function() {')
                .toEndsWith('};');
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
            
            expect(lines).to.be.eql([
                { tag: 'title', value: 'Test block' },
                { tag: 'description', value: 'With description\nas second block' },
                { tag: 'module', value: 'testmodule' },
                { tag: 'param', value: '{object} foo Foo is footastic' },
                { tag: 'public', value: '' }
            ]);
        });
    });

    describe('parse', function() {
        it('Should parse banana.js', function() {
            var docblock = new DocBlockParser();
            var result = docblock.parse(fl.read(__dirname + '/fixtures/banana.js'));

            inspect(result[0]).toHaveProps({
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

            inspect(result[1]).toHaveProps({
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
                ].join('\n'),
                code: 'var NAME = \'banana\''
            });
        });
    });
});
