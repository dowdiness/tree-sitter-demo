"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runExamples = runExamples;
exports.evaluateExpression = evaluateExpression;
var Parser = require("tree-sitter");
var Calculator = require("./bindings/node");
// Initialize the parser with the calculator grammar
var parser = new Parser();
parser.setLanguage(Calculator);
// Example 1: Parse a simple expression
function parseSimpleExpression() {
    var sourceCode = '2 + 3 * 4';
    var tree = parser.parse(sourceCode);
    console.log('Source:', sourceCode);
    console.log('Parse tree:', tree.rootNode.toString());
    return tree;
}
// Example 2: Parse and traverse the AST
function parseAndTraverse() {
    var sourceCode = '(10 + 5) * 2.5';
    var tree = parser.parse(sourceCode);
    function traverse(node, depth) {
        if (depth === void 0) { depth = 0; }
        var indent = '  '.repeat(depth);
        console.log("".concat(indent).concat(node.type, ": \"").concat(node.text, "\""));
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            traverse(child, depth + 1);
        }
    }
    console.log('\nTraversing AST for:', sourceCode);
    traverse(tree.rootNode);
    return tree;
}
// Example 3: Extract numbers from expression
function extractNumbers(sourceCode) {
    var tree = parser.parse(sourceCode);
    var numbers = [];
    function findNumbers(node) {
        if (node.type === 'number') {
            numbers.push(parseFloat(node.text));
        }
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            findNumbers(child);
        }
    }
    findNumbers(tree.rootNode);
    return numbers;
}
// Example 4: Validate expression syntax
function validateExpression(sourceCode) {
    var tree = parser.parse(sourceCode);
    var errors = [];
    function checkForErrors(node) {
        if (node.hasError) {
            errors.push("Syntax error at \"".concat(node.text, "\""));
        }
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            checkForErrors(child);
        }
    }
    checkForErrors(tree.rootNode);
    return {
        valid: errors.length === 0,
        errors: errors
    };
}
// Example 5: Get operator precedence information
function analyzeOperators(sourceCode) {
    var tree = parser.parse(sourceCode);
    var operators = [];
    function findOperators(node) {
        if (node.type === 'binary_expression') {
            // Find the operator in this binary expression
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var text = child.text;
                if (['+', '-', '*', '/', '%'].includes(text)) {
                    var precedence = ['*', '/', '%'].includes(text) ? 2 : 1;
                    operators.push({ operator: text, precedence: precedence });
                    break;
                }
            }
        }
        for (var _b = 0, _c = node.children; _b < _c.length; _b++) {
            var child = _c[_b];
            findOperators(child);
        }
    }
    findOperators(tree.rootNode);
    return operators;
}
// Example 6: Pretty print the expression tree
function prettyPrintTree(sourceCode) {
    var tree = parser.parse(sourceCode);
    function printNode(node, depth) {
        if (depth === void 0) { depth = 0; }
        var indent = '  '.repeat(depth);
        var result = "".concat(indent, "(").concat(node.type);
        if (node.children.length === 0) {
            result += " \"".concat(node.text, "\"");
        }
        else {
            result += '\n';
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                result += printNode(child, depth + 1);
            }
            result += indent;
        }
        result += ')\n';
        return result;
    }
    return printNode(tree.rootNode);
}
// Example usage
function runExamples() {
    console.log('=== Tree-sitter Calculator Parser Examples ===\n');
    // Example 1
    console.log('1. Simple expression parsing:');
    parseSimpleExpression();
    console.log();
    // Example 2
    console.log('2. AST traversal:');
    parseAndTraverse();
    console.log();
    // Example 3
    console.log('3. Extract numbers:');
    var numbers = extractNumbers('3.14 + 2 * 5.5');
    console.log('Numbers found:', numbers);
    console.log();
    // Example 4
    console.log('4. Validate expressions:');
    console.log('Valid:', validateExpression('2 + 3'));
    console.log('Invalid:', validateExpression('2 + + 3'));
    console.log();
    // Example 5
    console.log('5. Analyze operators:');
    var ops = analyzeOperators('2 + 3 * 4 - 1');
    console.log('Operators:', ops);
    console.log();
    // Example 6
    console.log('6. Pretty print tree:');
    console.log(prettyPrintTree('(2 + 3) * 4'));
}
// Simple calculator evaluator using the AST
function evaluateExpression(sourceCode) {
    var tree = parser.parse(sourceCode);
    function evaluate(node) {
        switch (node.type) {
            case 'source_file':
                // Evaluate the first expression
                return evaluate(node.children[0]);
            case 'expression':
                // Evaluate the child expression
                return evaluate(node.children[0]);
            case 'number':
                return parseFloat(node.text);
            case 'binary_expression':
                var left = evaluate(node.children[0]);
                var operator = node.children[1].text;
                var right = evaluate(node.children[2]);
                switch (operator) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/': return left / right;
                    case '%': return left % right;
                    default: throw new Error("Unknown operator: ".concat(operator));
                }
            case 'grouped_expression':
                // Evaluate the expression inside parentheses
                return evaluate(node.children[1]);
            default:
                throw new Error("Unknown node type: ".concat(node.type));
        }
    }
    return evaluate(tree.rootNode);
}
// Run examples if this file is executed directly
if (require.main === module) {
    runExamples();
    // Test the evaluator
    console.log('\n=== Expression Evaluator ===');
    var expressions = [
        '2 + 3',
        '2 + 3 * 4',
        '(2 + 3) * 4',
        '10 / 2 + 3',
        '15 % 4 + 1'
    ];
    expressions.forEach(function (expr) {
        try {
            var result = evaluateExpression(expr);
            console.log("".concat(expr, " = ").concat(result));
        }
        catch (error) {
            console.log("".concat(expr, " = ERROR: ").concat(error.message));
        }
    });
}
