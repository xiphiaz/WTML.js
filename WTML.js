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

                    elements.push(wtmlRaw);

                    return elements;
                }
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
