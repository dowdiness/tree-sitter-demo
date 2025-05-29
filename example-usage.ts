import * as Parser from 'tree-sitter';
import * as Calculator from './bindings/node';

// Initialize the parser with the calculator grammar
const parser = new Parser();
parser.setLanguage(Calculator);

// Example 1: Parse a simple expression
function parseSimpleExpression() {
  const sourceCode = '2 + 3 * 4';
  const tree = parser.parse(sourceCode);

  console.log('Source:', sourceCode);
  console.log('Parse tree:', tree.rootNode.toString());

  return tree;
}

// Example 2: Parse and traverse the AST
function parseAndTraverse() {
  const sourceCode = '(10 + 5) * 2.5';
  const tree = parser.parse(sourceCode);

  function traverse(node: Parser.SyntaxNode, depth = 0) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.type}: "${node.text}"`);

    for (const child of node.children) {
      traverse(child, depth + 1);
    }
  }

  console.log('\nTraversing AST for:', sourceCode);
  traverse(tree.rootNode);

  return tree;
}

// Example 3: Extract numbers from expression
function extractNumbers(sourceCode: string): number[] {
  const tree = parser.parse(sourceCode);
  const numbers: number[] = [];

  function findNumbers(node: Parser.SyntaxNode) {
    if (node.type === 'number') {
      numbers.push(parseFloat(node.text));
    }

    for (const child of node.children) {
      findNumbers(child);
    }
  }

  findNumbers(tree.rootNode);
  return numbers;
}

// Example 4: Validate expression syntax
function validateExpression(sourceCode: string): { valid: boolean; errors: string[] } {
  const tree = parser.parse(sourceCode);
  const errors: string[] = [];

  function checkForErrors(node: Parser.SyntaxNode) {
    if (node.hasError) {
      errors.push(`Syntax error at "${node.text}"`);
    }

    for (const child of node.children) {
      checkForErrors(child);
    }
  }

  checkForErrors(tree.rootNode);

  return {
    valid: errors.length === 0,
    errors
  };
}

// Example 5: Get operator precedence information
function analyzeOperators(sourceCode: string) {
  const tree = parser.parse(sourceCode);
  const operators: Array<{ operator: string; precedence: number }> = [];

  function findOperators(node: Parser.SyntaxNode) {
    if (node.type === 'binary_expression') {
      // Find the operator in this binary expression
      for (const child of node.children) {
        const text = child.text;
        if (['+', '-', '*', '/', '%'].includes(text)) {
          const precedence = ['*', '/', '%'].includes(text) ? 2 : 1;
          operators.push({ operator: text, precedence });
          break;
        }
      }
    }

    for (const child of node.children) {
      findOperators(child);
    }
  }

  findOperators(tree.rootNode);
  return operators;
}

// Example 6: Pretty print the expression tree
function prettyPrintTree(sourceCode: string): string {
  const tree = parser.parse(sourceCode);

  function printNode(node: Parser.SyntaxNode, depth = 0): string {
    const indent = '  '.repeat(depth);
    let result = `${indent}(${node.type}`;

    if (node.children.length === 0) {
      result += ` "${node.text}"`;
    } else {
      result += '\n';
      for (const child of node.children) {
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
export function runExamples() {
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
  const numbers = extractNumbers('3.14 + 2 * 5.5');
  console.log('Numbers found:', numbers);
  console.log();

  // Example 4
  console.log('4. Validate expressions:');
  console.log('Valid:', validateExpression('2 + 3'));
  console.log('Invalid:', validateExpression('2 + + 3'));
  console.log();

  // Example 5
  console.log('5. Analyze operators:');
  const ops = analyzeOperators('2 + 3 * 4 - 1');
  console.log('Operators:', ops);
  console.log();

  // Example 6
  console.log('6. Pretty print tree:');
  console.log(prettyPrintTree('(2 + 3) * 4'));
}

// Simple calculator evaluator using the AST
export function evaluateExpression(sourceCode: string): number {
  const tree = parser.parse(sourceCode);

  function evaluate(node: Parser.SyntaxNode): number {
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
        const left = evaluate(node.children[0]);
        const operator = node.children[1].text;
        const right = evaluate(node.children[2]);

        switch (operator) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return left / right;
          case '%': return left % right;
          default: throw new Error(`Unknown operator: ${operator}`);
        }

      case 'grouped_expression':
        // Evaluate the expression inside parentheses
        return evaluate(node.children[1]);

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  return evaluate(tree.rootNode);
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();

  // Test the evaluator
  console.log('\n=== Expression Evaluator ===');
  const expressions = [
    '2 + 3',
    '2 + 3 * 4',
    '(2 + 3) * 4',
    '10 / 2 + 3',
    '15 % 4 + 1'
  ];

  expressions.forEach(expr => {
    try {
      const result = evaluateExpression(expr);
      console.log(`${expr} = ${result}`);
    } catch (error) {
      console.log(`${expr} = ERROR: ${(error as Error).message}`);
    }
  });
}
