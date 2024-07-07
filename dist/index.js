const themeChooserEl = document.querySelector('.choose-theme__scroller');
const mainEl = document.querySelector('.main');
const resultEl = document.querySelector('.result');
const previousNumEl = document.querySelector('.previous-num');

const buttonsNumEl = document.querySelectorAll('.num');
const delButton = document.querySelector('.del');
const buttonsCharEl = document.querySelectorAll('.char');
const resetButton = document.querySelector('.reset');
const equalButton = document.querySelector('.equal');

let preferedTheme = localStorage.getItem('theme');
if(preferedTheme === null) {
    localStorage.setItem('theme', '1');
    preferedTheme = localStorage.getItem('theme');
}
mainEl.classList.add(`theme-${preferedTheme}`);

let theme = parseInt(mainEl.className[11]);
let num1 = 0;
let num2 = 0;
let num3 = 0;
let num = 0;
let float = false;
let result = '';
let prevChar = '';
let char = '';

const keyToButtonMap = {
    '0': '.num[value="0"]',
    '1': '.num[value="1"]',
    '2': '.num[value="2"]',
    '3': '.num[value="3"]',
    '4': '.num[value="4"]',
    '5': '.num[value="5"]',
    '6': '.num[value="6"]',
    '7': '.num[value="7"]',
    '8': '.num[value="8"]',
    '9': '.num[value="9"]',
    '.': '.num[value="."]',
    '+': '.char[value="+"]',
    '-': '.char[value="-"]',
    '*': '.char[value="*"]',
    '/': '.char[value="/"]',
    'Enter': '.equal',
    '=': '.equal',
    'Backspace': '.del',
    'Delete': '.reset'
};

document.addEventListener('keydown', (event) => {
    const buttonSelector = keyToButtonMap[event.key];
    if (buttonSelector) {
        const button = document.querySelector(buttonSelector);
        if (button) {
            button.click();
        }
    }
});

function action(char, num1, num2) {
    switch (char) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 === 0) {
                return 'Error';
            }
            return num1 / num2;
    }
}

function resetEverything() {
    num1 = 0;
    num2 = 0;
    num3 = 0;
    float = false;
    result = '';
    prevChar = '';
    char = '';
    resultEl.innerHTML = '0';
    previousNumEl.innerHTML = '0';
    for (let i of buttonsCharEl) {
        i.classList.remove('active');
    }
}

resetButton.addEventListener('click', () => {
    resetEverything();
})

function equal() {
    float = false;
    for (let i of buttonsCharEl) {
        i.classList.remove('active');
    }
    if (result !== '') {
        if (num1 !== 0) {
            if (prevChar === '') {
                num2 = parseFloat(result);
                result = action(char, num1, num2);
            }
            else {
                if ((char === '*' || char === '/') && (prevChar !== '*' && prevChar !== '/')) {
                    let temp = parseFloat(result);
                    result = action(char, num2, temp);
                    result = roundUpToDecimal(result);
                    result = action(prevChar, num1, result);
                } else {
                    let temp = parseFloat(result);
                    result = action(char, num3, temp);
                }
            }
            result = roundUpToDecimal(result);
            resultEl.innerHTML = result;
            previousNumEl.innerHTML = '';
            result = result.toString();
            num1 = 0;
            num2 = 0;
            num3 = 0;
            char = '';
            prevChar = '';
        }
    }
}

function roundUpToDecimal(num) {
    return parseFloat(num.toFixed(5))
}

equalButton.addEventListener('click', () => {
    equal();
})

for (let b of buttonsCharEl) {
    b.addEventListener('click', () => {
        float = false;
        let clicked = false;
        for (let i of buttonsCharEl) {
            if (i.className.split(' ')[2] === 'active') {
                i.classList.remove('active');
                clicked = true;
            }
        }
        if (result !== '') {
            num = parseFloat(result);
            b.classList.add('active');
            previousNumEl.innerHTML = result + b.value;
            if (num1 === 0) {
                num1 = parseFloat(result);
                char = b.value;
                resultEl.innerHTML = '0';
                result = '';
            } else {
                if (prevChar === '') {
                    num2 = parseFloat(result);
                    prevChar = char;
                    char = b.value;
                    result = action(prevChar, num1, num2);
                    result = roundUpToDecimal(result);
                    num3 = result;
                    resultEl.innerHTML = result;
                    result = '';
                }
                else {
                    if ((char === '*' || char === '/') && (prevChar !== '*' && prevChar !== '/')) {
                        let temp = parseFloat(result);
                        result = action(char, num2, temp);
                        result = roundUpToDecimal(result);
                        result = action(prevChar, num1, result);
                        result = roundUpToDecimal(result);
                        [num1, num2, num3] = [num3, temp, result];
                    } else {
                        let temp = parseFloat(result);
                        result = action(char, num3, temp);
                        result = roundUpToDecimal(result);
                        [num1, num2, num3] = [num3, temp, result];
                    }
                    resultEl.innerHTML = result;
                    result = '';
                    prevChar = char;
                    char = b.value;
                }
            }
        } else if (clicked) {
            previousNumEl.innerHTML = num + b.value;
            b.classList.add('active');
            char = b.value;
        }
    })
}

themeChooserEl.addEventListener('click', () => {
    if (theme == 3) {
        mainEl.classList.remove('theme-3');
        mainEl.classList.add('theme-1');
        theme = 1;
        localStorage.setItem('theme', '1');
    } else {
        mainEl.classList.remove(`theme-${theme}`);
        mainEl.classList.add(`theme-${theme + 1}`);
        theme = theme + 1;
        localStorage.setItem('theme', theme.toString());
    }
})

delButton.addEventListener('click', () => {
    if (result[result.length - 1] == '.') {
        float = false;
    }
    result = result.slice(0, -1);
    if (result.length === 0) {
        resultEl.innerHTML = '0';
    } else {
        resultEl.innerHTML = result;
    }
})

for (let b of buttonsNumEl) {
    b.addEventListener('click', () => {
        if (result.length <= 16) {
            for (let i of buttonsCharEl) {
                i.classList.remove('active');
            }
            if (b.value === '.') {
                if (result.length === 0) {
                    result += '0.';
                } else if (!float) {
                    result += b.value;
                    float = true;
                }
            } else {
                result += b.value;
            }
            resultEl.innerHTML = result;
        }
    })
}