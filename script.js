"use strict";

// Calculator state
let result = null;
let operator = null;
let currentOperand = 'firstOperand';

let hasUserInput = null; // Tracks if any number has been entered since page load
let isCalculationFinished = false;

// Calculator memory
const calculator = {
    firstOperand: "0",
    secondOperand: "0",
}

const btnContainer = document.querySelector(".btn-container");
const display = document.querySelector(".calc-display");

// Basic arithmetic operations
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => b !== 0 ? a / b : 'Error'
};

// Core calculator functions
const calculate = (a, operator, b) => {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);

    const value = operations[operator]?.(num1, num2) ?? "Error";
    return value !== "Error" ? formatNumber(value) : value;
}

const formatNumber = (value) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(3); // Limit decimal places to prevent display overflow
}

const validateValue = (value) => {
    if (isNaN(value)) {
        return false;
    }

    if (String(value).length > 12) {
        return false;
    }
    return true;
};

// Display handling
const handleDisplay = (value) => {
    if (validateValue(value)) {
        display.textContent = value.replace(".", ",");
    } else {
        display.textContent = "Error";
    }
};

const handleNumber = (value) => {
    hasUserInput = true;
    isCalculationFinished = false

    // Reset calculator if previous operation resulted in error
    if (display.textContent == "Error") {
        calculator.firstOperand = "0";
        handleDisplay(calculator.firstOperand);
    }

    if (result === "Error") {
        calculator.firstOperand = "0";
        calculator.secondOperand = "0";
        result = null;
        operator = null;
        currentOperand = "firstOperand";
    }

    calculator[currentOperand] = calculator[currentOperand] === "0" ? value : calculator[currentOperand] + value;

    handleDisplay(calculator[currentOperand]);
};

const handleOperator = (value) => {
    // Prevent operator selection without first number
    if (!hasUserInput) {
        return;
    }

    operator = value;
    currentOperand = "secondOperand";
};

const handleDecimal = (value) => {
    // Prevent multiple decimal points
    if (display.textContent.includes(".")) {
        return;
    }
    calculator[currentOperand] = calculator[currentOperand] + value;

    handleDisplay(calculator[currentOperand]);
};

const handleClearEntry = () => {
    // Clear only current entry, maintain previous operation state
    calculator[currentOperand] = "0";
    handleDisplay(calculator[currentOperand]);

    if (currentOperand === "secondOperand") {
        operator = null;
    }
};

const handleInvert = () => {
    calculator[currentOperand] = calculator[currentOperand].startsWith("-")
        ? calculator[currentOperand].slice(1)
        : "-" + calculator[currentOperand];

    handleDisplay(calculator[currentOperand]);
};

const handleDelete = () => {
    if (isCalculationFinished) {
        return;
    }

    calculator[currentOperand] = calculator[currentOperand].slice(0, -1) === "" ? "0" : calculator[currentOperand].slice(0, -1);

    handleDisplay(calculator[currentOperand]);
}

const handleCalculate = () => {
    result = calculate(calculator.firstOperand, operator, calculator.secondOperand);
    handleDisplay(result);

    calculator.firstOperand = result;
    calculator.secondOperand = "0";

    operator = null;
    currentOperand = "firstOperand";
    isCalculationFinished = true;
};

// Event listener for all calculator buttons
btnContainer.addEventListener('click', (e) => {
    const button = e.target.closest('.calc-btn');
    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    switch (action) {
        case 'number':
            handleNumber(value);
            break;
        case 'operator':
            handleOperator(value);
            break;
        case "clear":
            handleClearEntry();
            break;
        case "invert":
            handleInvert();
            break;
        case "equals":
            handleCalculate();
            break;
        case "decimal":
            handleDecimal(value);
            break;
        case "delete":
            handleDelete();
            break;
    }
});