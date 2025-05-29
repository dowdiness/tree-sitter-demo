#!/bin/bash

echo "Running Tree-sitter Calculator Parser Test Suites"
echo "================================================="

test_files=(
    "basic-arithmetic.calc"
    "operator-precedence.calc"
    "parentheses-grouping.calc"
    "decimal-numbers.calc"
    "complex-expressions.calc"
    "edge-cases.calc"
)

for test_file in "${test_files[@]}"; do
    echo
    echo "Testing: $test_file"
    echo "-------------------"
    tree-sitter parse "test-suites/$test_file"
    
    if [ $? -eq 0 ]; then
        echo "✅ $test_file: PASSED"
    else
        echo "❌ $test_file: FAILED"
    fi
done

echo
echo "All tests completed!"