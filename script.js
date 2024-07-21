// script.js

document.addEventListener("DOMContentLoaded", function () {
    const display = document.getElementById("display");
    const buttons = document.querySelectorAll(".button");
    let currentInput = "";
    let operatorStack = [];
    let valueStack = [];

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const value = this.getAttribute("data-value");

            if (value === "C") {
                currentInput = "";
                operatorStack = [];
                valueStack = [];
                display.innerText = "0";
            } else if (value === "=") {
                if (currentInput !== "") {
                    valueStack.push(parseFloat(currentInput));
                }
                display.innerText = evaluate().toString();
                currentInput = "";
                operatorStack = [];
                valueStack = [];
            } else if (["+", "-", "x", "/", "%", "^", "(", ")"].includes(value)) {
                if (currentInput !== "") {
                    valueStack.push(parseFloat(currentInput));
                    currentInput = "";
                }
                if (value === "(") {
                    operatorStack.push(value);
                } else if (value === ")") {
                    while (operatorStack[operatorStack.length - 1] !== "(") {
                        valueStack.push(applyOperator(operatorStack.pop(), valueStack.pop(), valueStack.pop()));
                    }
                    operatorStack.pop();
                } else {
                    while (shouldEvaluate(value)) {
                        valueStack.push(applyOperator(operatorStack.pop(), valueStack.pop(), valueStack.pop()));
                    }
                    operatorStack.push(value);
                }
                display.innerText += value;
            } else {
                currentInput += value;
                display.innerText = currentInput;
            }
        });
    });

    function shouldEvaluate(operator) {
        if (operatorStack.length === 0) return false;
        const precedence = {
            "+": 1,
            "-": 1,
            "x": 2,
            "/": 2,
            "%": 2,
            "^": 3,
            "(": 0,
            ")": 0
        };
        return precedence[operator] <= precedence[operatorStack[operatorStack.length - 1]];
    }

    function applyOperator(operator, b, a) {
        switch (operator) {
            case "+":
                return a + b;
            case "-":
                return a - b;
            case "x":
                return a * b;
            case "/":
                return a / b;
            case "%":
                return a % b;
            case "^":
                return Math.pow(a, b);
            default:
                return 0;
        }
    }

    function evaluate() {
        while (operatorStack.length > 0) {
            valueStack.push(applyOperator(operatorStack.pop(), valueStack.pop(), valueStack.pop()));
        }
        return valueStack.pop();
    }
});
