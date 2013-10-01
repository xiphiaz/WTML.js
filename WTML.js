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

                    elements.push(cleanedRawInput);

                    return elements;
                };

                var preProcess = function(wtmlRaw){
                    var commentMatch  = /\/\/.*?(?=\n)|\/\*([^*]|[\r\n])*\*\//g; //matches all comments in c form
                    var cleaned = wtmlRaw.replace(commentMatch, ''); //strip all comments
//                    var cleaned = wtmlRaw.replace(/h/g, '?'); //strip all comments
                    var chunks = [];
                    var matches;
                    while(matches = finalRegex.exec(cleaned)){
                        chunks.push(matches);
                    }
                    console.log('chunks: ', chunks);

                    return cleaned;
                };

                /**
                 * Definitions
                 */

                    /*
                $tag = '[a-zA-Z0-9]+';
                $class = '((\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*)*';
                $id = '(\#-?[_a-zA-Z]+[_a-zA-Z0-9-]*)*';
                $attribute = '(\[.*?\])*';
                $content = '(\(\".*?\"\))*)*';

                $selectorRegex = $tag.$class.$id.$attribute.$content;

                $wtmlCommentLong = "\/\/.*?(?=\n)";  // c style block kcommenting out
                $wtmlCommentShort = "\/\*.*?\*\/";  // c style one line commenting out
                $twigBlock = "{%.*?%}"; //block level twig element
                $twigComment = "{#.*?#}";
                $htmlComment = "<!--.*?-->";
                $nestingGrammar = "[{>}]"; //syntax used for delimiting nesting of html block elements (in place of closure tags)

                $finalRegex = "/($wtmlCommentLong)|($wtmlCommentShort)|($twigBlock)|($twigComment)|($htmlComment)|($selectorRegex)|($nestingGrammar)/s";

                */

//                var htmlTag = /[a-zA-Z0-9]+/,
//                    className = /(\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*)*/,
//                    id = /(\#-?[_a-zA-Z]+[_a-zA-Z0-9-]*)*/,
//                    attribute = /(\[.*?\])*/,
//                    content = /(\(\".*?\"\))*/
//                ;
//
//                var selectorRegex = new RegExp( htmlTag.source +'(' +className.source + id.source + attribute.source + content.source + ')*', 'g') ;


                //([a-zA-Z0-9])+(\#(-?[_a-zA-Z]+[_a-zA-Z0-9-]))?(\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*)*(\[.*?\])*(\(.*?\))?  |||| build with debuggex with the test string div#sample.example[foo="bar"]({{foobar}})

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

        var Parser = (function(){ //build up the syntax tree with the elements
            return function(){
                this.process = function(elements){
                    var domTree = {};

                    domTree.test = elements[0];

                    return domTree;
                }
            };
        })();

        var Compiler = (function(){ //build up the syntax tree with the elements
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
