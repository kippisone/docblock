DocBlock
========

[![Build Status](https://travis-ci.org/Andifeind/docblock.svg?branch=master)](https://travis-ci.org/Andifeind/docblock)

A powerfull docblock parser for comment blocks. DocBlock isn't tethered to any language.
It simply parses docblocks and returns the result as a JSON object.



```
// banana.js

/**
 * Banana constructor
 *
 * Banana example object
 *
 * @constructor
 */
var Banana = function() {

}

/**
 * DocBlock comment
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
```

Let's parse the banana object.

```js
var fs = require('fs');
var DocBlock = require('docblock');

var source = fs.readFileSync('./banana.js');
var docBlock = new DocBlock();
var result = docBlock.parse(source, 'js');
```

The result looks like:

```js
[
    {
        "title": "Banana constructor",
        "description": "Creates a banana instance",
        "tags": {
            "isPublic": false,
            "isProtected": false,
            "isPrivate": false,
            "isDeprecated": false,
            "ignore": false,
            "constructor": "Banana"
        },
        "code": "var Banana = function() {\n    \n}",
        "raw": "/**\n * Banana constructor\n *\n * Creates a banana instance\n *\n * @constructor\n */",
        "pos": 80
    },
    {
        "title": "Peels a banana",
        "description": "This method peels a banana and calls a callback",
        "tags": {
            "isPublic": false,
            "isProtected": false,
            "isPrivate": false,
            "isDeprecated": false,
            "ignore": false,
            "method": "peelIt",
            "chainable": true,
            "params": [
                {
                    "type": "string",
                    "name": "startPoint",
                    "description": "Sets the peeling start point."
                },
                {
                    "type": "function",
                    "name": "[callback]",
                    "description": "Callback function"
                }
            ],
            "returns": {
                "type": "object",
                "description": "Returns this value"
            }
        },
        "code": "Banana.prototype.peelIt = function(startPoint, callback) {\n    return this;\n}",
        "raw": "/**\n * Peels a banana\n *\n * This method peels a banana and calls a callback\n * \n * @method peelIt\n * @chainable\n * @param {string} startPoint Sets the peeling start point.\n * @param {function} [callback] Callback function\n * @returns {object} Returns this value\n */",
        "pos": 380
    }
]

```

### Parse markdown

Docblock parse markdown per default. Markdown parsing can be disabled by setting the skipMarkdown option

```js
var docblock = new DocBlock({
    skipMarkdown: true
});
```
