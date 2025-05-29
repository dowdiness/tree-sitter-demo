# Tree-sitter Calculator Parser

A comprehensive Tree-sitter parser implementation for mathematical calculator expressions, demonstrating parsing capabilities for arithmetic operations with proper operator precedence and expression grouping.

## Features

- **Arithmetic Operations**: Supports `+`, `-`, `*`, `/`, `%` operators
- **Operator Precedence**: Multiplication and division have higher precedence than addition and subtraction
- **Expression Grouping**: Parentheses for controlling evaluation order
- **Decimal Numbers**: Full support for floating-point numbers
- **Nested Expressions**: Handle complex multi-level mathematical expressions

## Grammar Overview

The parser recognizes:
- **Numbers**: Integer (`42`) and decimal (`3.14`) values
- **Binary Expressions**: Operations between two expressions
- **Grouped Expressions**: Parenthesized expressions `(2 + 3)`
- **Operator Precedence**: `*`, `/`, `%` (precedence 2) before `+`, `-` (precedence 1)

## Installation

1. Install Tree-sitter CLI:
```bash
npm install tree-sitter-cli
```

2. Clone this repository:
```bash
git clone https://github.com/dowdiness/tree-sitter-demo.git
cd tree-sitter-demo
```

3. Install dependencies:
```bash
npm install
```

4. Generate the parser:
```bash
tree-sitter generate
```

## Usage

### Parse Calculator Expressions

```bash
# Parse a single expression
echo "2 + 3 * 4" | tree-sitter parse

# Parse from file
tree-sitter parse test.calc
```

### Example Parse Trees

**Simple Expression**: `2 + 3`
```
(source_file
  (expression
    (binary_expression
      (expression (number))
      (expression (number)))))
```

**Operator Precedence**: `2 + 3 * 4`
```
(source_file
  (expression
    (binary_expression
      (expression (number))
      (expression
        (binary_expression
          (expression (number))
          (expression (number)))))))
```

**Grouped Expression**: `(2 + 3) * 4`
```
(source_file
  (expression
    (binary_expression
      (expression
        (grouped_expression
          (expression
            (binary_expression
              (expression (number))
              (expression (number))))))
      (expression (number)))))
```

## Test Suites

The project includes comprehensive test suites covering all parser functionality:

### Running Tests

```bash
# Run all test suites
./test-suites/run-all-tests.sh

# Run individual test files
tree-sitter parse test-suites/basic-arithmetic.calc
tree-sitter parse test-suites/operator-precedence.calc
tree-sitter parse test-suites/parentheses-grouping.calc
tree-sitter parse test-suites/decimal-numbers.calc
tree-sitter parse test-suites/complex-expressions.calc
tree-sitter parse test-suites/edge-cases.calc
```

### Test Categories

1. **Basic Arithmetic** (`basic-arithmetic.calc`)
   - Simple operations: `1 + 2`, `5 - 3`, `4 * 6`, `8 / 2`, `9 % 4`

2. **Operator Precedence** (`operator-precedence.calc`)
   - Mixed operations: `2 + 3 * 4`, `10 - 6 / 2`, `5 * 3 + 2`

3. **Parentheses & Grouping** (`parentheses-grouping.calc`)
   - Grouped expressions: `(2 + 3) * 4`, `((2 + 3) * 4) - 1`

4. **Decimal Numbers** (`decimal-numbers.calc`)
   - Floating-point: `3.14 + 2.86`, `10.5 - 4.2`, `2.5 * 3.0`

5. **Complex Expressions** (`complex-expressions.calc`)
   - Multi-level nesting: `((2 + 3) * 4) - ((5 * 6) / 2)`

6. **Edge Cases** (`edge-cases.calc`)
   - Single numbers, zeros, multiple parentheses: `0`, `((((1))))`, `1 + 2 + 3 + 4 + 5`

## Grammar Structure

The grammar is defined in `grammar.js`:

```javascript
module.exports = grammar({
  name: 'calculator',
  rules: {
    source_file: $ => repeat($.expression),
    
    expression: $ => choice(
      $.number,
      $.binary_expression,
      $.grouped_expression
    ),
    
    binary_expression: $ => choice(
      prec.left(1, seq($.expression, choice('+', '-'), $.expression)),
      prec.left(2, seq($.expression, choice('*', '/', '%'), $.expression))
    ),
    
    grouped_expression: $ => seq('(', $.expression, ')'),
    
    number: $ => /\d+(\.\d+)?/
  }
});
```

## Development

### Tree-sitter Commands

```bash
# Generate parser from grammar
tree-sitter generate

# Build parser
tree-sitter build

# Start playground for interactive testing
tree-sitter playground

# Test parser
tree-sitter test

# Parse files
tree-sitter parse <file>
```

### Project Structure

```
├── grammar.js                 # Parser grammar definition
├── src/                      # Generated parser source code
├── bindings/                 # Language bindings (Node.js, Python, etc.)
├── test-suites/              # Comprehensive test files
│   ├── basic-arithmetic.calc
│   ├── operator-precedence.calc
│   ├── parentheses-grouping.calc
│   ├── decimal-numbers.calc
│   ├── complex-expressions.calc
│   ├── edge-cases.calc
│   └── run-all-tests.sh
├── test.calc                 # Basic test file
├── calculator-example.md     # Detailed explanation
└── README.md
```

## Use Cases

This Tree-sitter calculator parser is useful for:

- **Calculator Applications**: Building apps with syntax highlighting for mathematical expressions
- **Educational Tools**: Teaching parsing concepts and operator precedence
- **Code Editors**: Adding math expression support with syntax highlighting
- **Expression Validators**: Validating mathematical expressions in forms or APIs
- **AST Analysis**: Analyzing and transforming mathematical expressions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite: `./test-suites/run-all-tests.sh`
6. Submit a pull request

## License

This project is licensed under the MIT License.
