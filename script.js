// Get display element
const display = document.getElementById('display');

// Calculator state
let currentOperand = '';
let previousOperand = '';
let operation = undefined;
let shouldResetDisplay = false;

// Display functions
function updateDisplay() {
    if (currentOperand === '') {
        display.textContent = previousOperand || '0';
    } else {
        // Format number with commas for better readability
        const number = parseFloat(currentOperand);
        if (!isNaN(number) && currentOperand !== '.') {
            display.textContent = number.toLocaleString('en-US', {
                maximumFractionDigits: 10
            });
        } else {
            display.textContent = currentOperand;
        }
    }
}

function clearDisplay() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    shouldResetDisplay = false;
    display.textContent = '0';
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentOperand = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple leading zeros
    if (number === '0' && currentOperand === '0') return;
    
    // Handle number input
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentOperand = '';
        shouldResetDisplay = false;
    }
    
    // Check if current operand already has a decimal
    if (currentOperand.includes('.')) return;
    
    // Add decimal
    if (currentOperand === '') {
        currentOperand = '0.';
    } else {
        currentOperand += '.';
    }
    
    updateDisplay();
}

function appendOperator(op) {
    // Don't allow operator if no current operand
    if (currentOperand === '') return;
    
    // If there's already an operation, calculate first
    if (previousOperand !== '' && operation !== undefined) {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
}

function calculate() {
    // Check if we have all required values
    if (operation === undefined || previousOperand === '' || currentOperand === '') return;
    
    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    // Check for valid numbers
    if (isNaN(prev) || isNaN(current)) return;
    
    // Perform calculation
    switch(operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Error: Cannot divide by zero!');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Handle decimal precision
    result = Math.round(result * 1000000) / 1000000;
    
    // Update state with result
    currentOperand = result.toString();
    previousOperand = '';
    operation = undefined;
    shouldResetDisplay = true;
    
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if (key >= '0' && key <= '9' || key === '.' || 
        key === '+' || key === '-' || key === '*' || key === '/' ||
        key === 'Enter' || key === '=' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Number keys
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    }
    
    // Decimal point
    else if (key === '.') {
        appendDecimal();
    }
    
    // Operator keys
    else if (key === '+') {
        appendOperator('+');
    }
    else if (key === '-') {
        appendOperator('-');
    }
    else if (key === '*') {
        appendOperator('*');
    }
    else if (key === '/') {
        appendOperator('/');
    }
    
    // Calculate
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    
    // Clear
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    }
    
    // Backspace - delete last character
    else if (key === 'Backspace') {
        if (currentOperand !== '') {
            currentOperand = currentOperand.slice(0, -1);
            updateDisplay();
        }
    }
});

// Initialize display
clearDisplay();
