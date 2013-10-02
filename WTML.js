/**
 * WTML.js
 * A WTML language parser in javascript. Converts wtml files to html files
 *
 * @author Zak Henry - 2013
 */



;
(function(){

    /**
     *
     * @constructor
     */
    this.WTMLTranslator = function(){

        var Lexer = (function(){ //break down the string into elements
            return function(){
                this.process = function(wtmlRaw){
                    var elements = [];

                    var cleanedRawInput = preProcess(wtmlRaw);
                    var matches;
                    while(matches = finalRegex.exec(cleanedRawInput)){

                        var element = {};
                        if (typeof matches[8] == 'string'){
                            element.type = 'nestingGrammar';
                            element.value = matches[8];
                        }
                        if (typeof matches[2] == 'string'){
                            element.type = 'selector';
                            element.value = matches[2];

                            element.selector = {};
                            element.selector.tag = matches[3];

                            if (typeof matches[3] !== 'undefined'){ //id
                                //throw an error, tag missing
                            }

                            if (typeof matches[4] !== 'undefined'){ //id
                                element.selector.id = matches[4].substr(1);
                            }
                            if (typeof matches[5] !== 'undefined'){ //class
                                element.selector.class = matches[5].substr(1).split('.');
                            }
                            if (typeof matches[6] !== 'undefined'){ //attr
                                element.selector.attr = matches[6].slice(1, -1).split(/\].*\[/);
                            }
                            if (typeof matches[7] !== 'undefined'){ //content
                                element.selector.content = matches[7].slice(1, -1); //strip off the braces
                            }
                        }
                        if (typeof matches[1] == 'string'){
                            element.type = 'htmlComment';
                            element.value = matches[1];
                        }

                        if (typeof element.type == 'undefined'){
                            //throw error
                        }

                        element.rawMatches = matches;

                        elements.push(element);
                    }

                    console.log('elements: ', elements);

                    elements.push(cleanedRawInput);

                    return elements;
                };

                var preProcess = function(wtmlRaw){
                    var commentMatch  = /\/\/.*?(?=\n)|\/\*([^*]|[\r\n])*\*\//g; //matches all comments in c form
                    var cleaned = wtmlRaw.replace(commentMatch, ''); //strip all comments
                    return cleaned;
                };

                var htmlTag = /([a-zA-Z0-9]+)/,
                    className = /((?:\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*)*)/,
                    id = /(#-?[_a-zA-Z]+[_a-zA-Z0-9-])?/,
                    attribute = /((?:\[.*?\])*)/,
                    content = /(\(.*?\))*/
                ;

                var selectorRegex = new RegExp( htmlTag.source + id.source + className.source + attribute.source + content.source, 'g') ;

                var htmlComment = /<!--.*?-->/,
                    nestingGrammar = /[{>}]/
                ;

                var finalRegex = new RegExp('('+ htmlComment.source + ')|('+selectorRegex.source + ')|(' + nestingGrammar.source + ')', 'g');
                    ///(htmlComment)|($selectorRegex)|($nestingGrammar)/s";

                console.log(selectorRegex);
                console.log(finalRegex);
            };
        })();


        /*
        Example DOM tree:
         */

        var domTreeExample = {
            children:[
                {
                    element: {},
                    children: [
                        {
                            element: {
                                tag: 'div',
                                id: 'example'
                                /* ... etc */
                            },
                            children: [

                            ]
                        },
                        {
                            element: {
                                tag: 'span',
                                id: 'example2'
                            },
                            children: [

                            ]
                        },
                        {
                            element: {
                                tag: 'code',
                                id: 'example3'
                            },
                            children: [

                            ]
                        }
                        /* ... etc */
                    ]
                }
            ],
            locate: function(locateKey){
                var retrieveObject = this;

                while(locateKey.length > 0){
                    var key = locateKey.shift();
                    console.log('key', key);
                    console.log('retrieveObject', retrieveObject)
                    retrieveObject = retrieveObject.children[key]; //drill down into object
                }

                return retrieveObject;
            }
        };

        var domAccessExample = domTreeExample.children[0].children[2].element.tag; //div
        var accessKey = [0, 2];

        domTreeExample.locate([0, 2]).element.class = "foobar";

        console.log('example access: ', domAccessExample);
        console.log('locate example:', domTreeExample.locate([0, 2]));

        var Parser = (function(){ //build up the syntax tree with the elements
            return function(){
                this.process = function(elements){

                    var domTree = {
                        children: [],
                        locate: function(locateKey){
                            var retrieveObject = this;
                            var keyCopy = locateKey.slice(0);

                            while(keyCopy.length > 0){
                                var key = keyCopy.shift();
//                                console.log('key', key);
//                                console.log('retrieveObject', retrieveObject);

                                if (typeof retrieveObject.children == 'undefined'){
                                    retrieveObject.children = [];
                                }
                                if (typeof retrieveObject.children[key] == 'undefined'){
                                    retrieveObject.children[key] = {};
                                }

                                retrieveObject = retrieveObject.children[key]; //drill down into object
                            }

                            return retrieveObject;
                        }
                    };

                    var domLocation = [-1];
                    for (var i = 0; i<elements.length; i++){
                        var currentElement = elements[i];
                        if (currentElement.type == 'selector'){
                            domLocation[domLocation.length-1] ++; //go to next location
                            domTree.locate(domLocation).element = currentElement;

                            console.log('inserted', currentElement.value, 'at', domLocation);
                        }
                        if (currentElement.type == 'nestingGrammar'){
                            if (currentElement.value == '{'){
                                domLocation.push(-1); //jump down a level
                            }else if (currentElement.value == '}'){
                                domLocation.pop(); //jump back up a level
                            }else if (currentElement.value == '>'){
//                                domLocation.push(-1);
                                //@todo do nothing for now, wait til I have a better visual on the dom tree manipulation
                            }
                        }

                    }

                    domTree.test = elements[0];

                    return domTree;
                }
            };
        })();

        var Compiler = (function(){ //build up the html from the syntax tree
            return function(){
                this.process = function(domTree){
                    var html = '';

                    html = domTree.test;

                    return html;
                }
            };
        })();

        this.translate = function(inputWTML){

            var lexer = new Lexer(),
                parser = new Parser(),
                compiler = new Compiler()
            ;

            var elements = lexer.process(inputWTML),
                domTree = parser.process(elements)
            ;

            console.log('elements', elements);
            console.log('domTree', domTree);

            return compiler.process(domTree);
        };

        return this;
    };

})();
