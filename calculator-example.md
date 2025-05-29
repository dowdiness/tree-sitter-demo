# Tree-sitter Calculator Example

This document demonstrates how to use Tree-sitter to parse simple calculator expressions.

## Overview

Tree-sitter can parse mathematical expressions and build a syntax tree that represents the structure of the calculation. This is useful for building calculators, mathematical expression evaluators, or syntax highlighting for math expressions.

## Grammar Structure

A basic calculator grammar in Tree-sitter would define rules for:

- **Numbers**: Integer and decimal values
- **Operators**: `+`, `-`, `*`, `/`, `%`
- **Parentheses**: For grouping expressions
- **Expressions**: Recursive rules for combining numbers and operators

## Example Expressions

Here are some calculator expressions and how Tree-sitter would parse them:

### Simple Addition
```
2 + 3
```
**Parse Tree:**
```
expression
├── number: "2"
├── operator: "+"
└── number: "3"
```

### Complex Expression with Precedence
```
2 + 3 * 4
```
**Parse Tree:**
```
expression
├── number: "2"
├── operator: "+"
└── expression
    ├── number: "3"
    ├── operator: "*"
    └── number: "4"
```

### Parenthesized Expression
```
(2 + 3) * 4
```
**Parse Tree:**
```
expression
├── grouped_expression
│   └── expression
│       ├── number: "2"
│       ├── operator: "+"
│       └── number: "3"
├── operator: "*"
└── number: "4"
```

## Grammar Rules (Conceptual)

A simplified Tree-sitter grammar for a calculator might include:

```javascript
module.exports = grammar({
  name: 'calculator',

  rules: {
    expression: $ => choice(
      $.number,
      $.binary_expression,
      $.grouped_expression
    ),

    binary_expression: $ => prec.left(1, seq(
      $.expression,
      $.operator,
      $.expression
    )),

    grouped_expression: $ => seq(
      '(',
      $.expression,
      ')'
    ),

    operator: $ => choice('+', '-', '*', '/', '%'),

    number: $ => /\d+(\.\d+)?/
  }
});
```

## Usage Benefits

Using Tree-sitter for calculator parsing provides:

1. **Accurate syntax trees** that respect operator precedence
2. **Error recovery** for malformed expressions
3. **Incremental parsing** for real-time calculation updates
4. **Syntax highlighting** capabilities
5. **Easy AST traversal** for evaluation

## Example Use Cases

- Building a calculator app with syntax highlighting
- Creating mathematical expression validators
- Developing educational tools that visualize expression parsing
- Building code editors with math expression support
