class Calculator {
    constructor(currentOperandElement) {
        this.currentOperandElement = currentOperandElement
        this.clear()
    }

    // Resets all calculator values
    clear() {
        this.currentOperand = '0'
        this.previousOperand = ''
        this.operation = undefined
    }

    // Removes the last digit from the current operand
    delete() {
        if (this.currentOperand.length <= 1) {
            this.currentOperand = '0'
            return
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    // Appends a number or decimal point
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString()
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString()
        }
    }

    // Selects the operation and prepares for the next number
    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return

        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = '0'
    }

    // Calculates the final result
    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        
        if (isNaN(prev) || isNaN(current)) return

        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case 'x': // Handle 'x' for multiplication
            case '*': // Handle '*' for keyboard input
                computation = prev * current
                break
            case '/':
                computation = prev / current
                break
            default:
                return
        }
        
        // Update state
        this.currentOperand = computation.toString()
        this.operation = undefined
        this.previousOperand = ''
    }

    // Formats the display numbers (adds comma separators)
    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    // Updates the HTML display element
    updateDisplay() {
        this.currentOperandElement.innerText = 
            this.getDisplayNumber(this.currentOperand)
    }
}


// ---------------------------------------------
// DOM SELECTORS AND EVENT LISTENERS
// ---------------------------------------------

// Select all buttons using their data-attributes
const numberButtons = document.querySelectorAll('[data-number]')
const operatorButtons = document.querySelectorAll('[data-operator]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]') // This is now 'RESET'

// Select the display element
const currentOperandElement = document.querySelector('[data-current-operand]')

// Theme Toggle elements
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeThumb = document.querySelector('[data-theme-thumb]');
const body = document.body;

// Initialize the Calculator object (removed previousOperandElement as per design)
const calculator = new Calculator(currentOperandElement)

// Set initial display to '0'
calculator.updateDisplay();

// Add listeners for Number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

// Add listeners for Operator buttons
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

// Add listener for Equals button
equalsButton.addEventListener('click', () => {
    calculator.compute()
    calculator.updateDisplay()
})

// Add listener for All Clear (RESET) button
allClearButton.addEventListener('click', () => {
    calculator.clear()
    calculator.updateDisplay()
})

// Add listener for Delete (DEL) button
deleteButton.addEventListener('click', () => {
    calculator.delete()
    calculator.updateDisplay()
})

// Bonus: Keyboard Support
document.addEventListener('keydown', e => {
    let key = e.key
    if (key >= '0' && key <= '9' || key === '.') {
        calculator.appendNumber(key)
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault() // Prevents default browser action (like clicking the last button)
        calculator.compute()
    } else if (key === 'Backspace') {
        calculator.delete()
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        calculator.chooseOperation(key === '*' ? 'x' : key) // Convert '*' to 'x' for display
    } else {
        return
    }
    calculator.updateDisplay()
})


// ---------------------------------------------
// THEME SWITCHING LOGIC
// ---------------------------------------------
let currentTheme = 1;

themeToggle.addEventListener('click', (e) => {
    const trackRect = themeToggle.getBoundingClientRect();
    const clickX = e.clientX;
    
    // Determine which third of the track was clicked
    const thirdWidth = trackRect.width / 3;
    let newTheme = currentTheme;

    if (clickX < trackRect.left + thirdWidth) {
        newTheme = 1;
    } else if (clickX < trackRect.left + (2 * thirdWidth)) {
        newTheme = 2;
    } else {
        newTheme = 3;
    }

    if (newTheme !== currentTheme) {
        setTheme(newTheme);
    }
});

function setTheme(themeNumber) {
    body.classList.remove(`theme-${currentTheme}`);
    body.classList.add(`theme-${themeNumber}`);
    currentTheme = themeNumber;
    updateThemeThumbPosition(themeNumber);
}

function updateThemeThumbPosition(themeNumber) {
    const trackWidth = themeToggle.offsetWidth; // Get current width of the track
    const thumbWidth = themeThumb.offsetWidth;
    const padding = parseFloat(getComputedStyle(themeToggle).paddingLeft); // Get the padding of the track

    // Calculate positions for 3 states
    // Position 1: Leftmost
    // Position 2: Center
    // Position 3: Rightmost
    if (themeNumber === 1) {
        themeThumb.style.left = `${padding}px`;
    } else if (themeNumber === 2) {
        themeThumb.style.left = `${padding + (trackWidth / 2) - (thumbWidth / 2)}px`;
    } else if (themeNumber === 3) {
        themeThumb.style.left = `${trackWidth - thumbWidth - padding}px`;
    }
    
    // Also update the thumb's background color based on the new theme's equal key color
    // This requires accessing CSS variables dynamically or mapping them
    const newEqualBtnBg = getComputedStyle(document.documentElement).getPropertyValue('--theme1-key-bg-equal');
    themeThumb.style.backgroundColor = newEqualBtnBg;
}

// Initialize theme on load (important for thumb position and colors)
document.addEventListener('DOMContentLoaded', () => {
    setTheme(1); // Set initial theme to 1
});