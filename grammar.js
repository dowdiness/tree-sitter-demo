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

    grouped_expression: $ => seq(
      '(',
      $.expression,
      ')'
    ),

    number: $ => /\d+(\.\d+)?/
  }
});