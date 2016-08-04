'use strict';

var DocBlock = require('../../lib/docBlock');
var inspect = require('inspect.js');

describe('Generic rules', function() {
    describe('tags', function() {
        it('Should parse @module tag', function() {
            var docArray = [
                { tag: 'module', value: 'foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    module: 'foo'
                }
            });
        });

        it('Should parse @submodule tag', function() {
            var docArray = [
                { tag: 'submodule', value: 'foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    submodule: 'foo'
                }
            });
        });

        it('Should parse @package tag', function() {
            var docArray = [
                { tag: 'package', value: 'foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    'package': 'foo'
                }
            });
        });

        it('Should parse @subpackage tag', function() {
            var docArray = [
                { tag: 'subpackage', value: 'foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    subpackage: 'foo'
                }
            });
        });

        it('Should parse @group tag', function() {
            var docArray = [
                { tag: 'group', value: 'foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                group: 'foo'
            });
        });

        it('Should parse @group tag with spaces in group name', function() {
            var docArray = [
                { tag: 'group', value: 'Foo group' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                group: 'Foo group'
            });
        });

        it('Should parse @name tag', function() {
            var docArray = [
                { tag: 'name', value: 'foo' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                name: 'foo'
            });
        });

        it('Should parse @type tag', function() {
            var docArray = [
                { tag: 'type', value: 'string' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    type: 'string'
                }
            });
        });

        it('Should parse an @example tag', function() {
            var docArray = [
                { tag: 'example', value: '{js}\n var foo = \'bar\';' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    examples: [{
                        type: 'js',
                        title: '',
                        content: 'var foo = \'bar\';'
                    }]
                }
            });
        });

        it('Should parse an @uninplemented tag', function() {
            var docArray = [
                { tag: 'unimplemented', value: '' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    isUnimplemented: true
                }
            });
        });

        it('Should parse an @beta tag', function() {
            var docArray = [
                { tag: 'beta', value: '' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    isBeta: true
                }
            });
        });

        it('Should parse an @new tag', function() {
            var docArray = [
                { tag: 'new', value: '' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    isNew: true
                }
            });
        });

        it('Should parse a @link tag', function() {
            var docArray = [
                { tag: 'link', value: 'External link https://example.com' },
                { tag: 'link', value: 'http://www.foo.com' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    links: [{
                        name: 'External link',
                        link: 'https://example.com'
                    }, {
                        name: '',
                        link: 'http://www.foo.com'
                    }]
                }
            });
        });

        it('Should parse @ignore tag', function() {
            var docArray = [
                { tag: 'ignore', value: '' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    ignore: true
                }
            });
        });

        it('Should parse an @preview tag', function() {
            var docArray = [
                { tag: 'preview', value: '{js}\n<div>Preview</div>' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    previews: [{
                        type: 'js',
                        name: '',
                        html: '<div>Preview</div>'
                    }]
                }
            });
        });

        it('Should parse a multiline @preview tag', function() {
            var docArray = [
                { tag: 'preview', value: '{js}\n<div>Preview</div>\n<span>Subline</span>' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    previews: [{
                        type: 'js',
                        name: '',
                        html: '<div>Preview</div>\n<span>Subline</span>'
                    }]
                }
            });
        });

        it('Should parse an @preview tag without type and name', function() {
            var docArray = [
                { tag: 'preview', value: '\n<div>Preview</div>' }
            ];

            var docBlock = new DocBlock('js').create(docArray);
            inspect(docBlock).hasProps({
                tags: {
                    previews: [{
                        type: 'js',
                        name: '',
                        html: '<div>Preview</div>'
                    }]
                }
            });
        });
    });
});
