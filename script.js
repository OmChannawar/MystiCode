document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const codeLengthRadios = document.querySelectorAll('input[name="codeLength"]');
    const charSetRadios = document.querySelectorAll('input[name="charSet"]'); 
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const generatedCodeDisplay = document.getElementById('generatedCodeDisplay');
    const copyBtn = document.getElementById('copyBtn');

    // Event Listeners
    generateBtn.addEventListener('click', generateRandomCode);
    clearBtn.addEventListener('click', clearDisplay);
    copyBtn.addEventListener('click', copyCodeToClipboard);

    const DIGITS = '0123456789';
    const ASCII_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const ASCII_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const ASCII_LETTERS = ASCII_LOWERCASE + ASCII_UPPERCASE;
    const ALPHANUMERIC = ASCII_LETTERS + DIGITS;
    const SPECIAL_CHARS = '!@#$%^&*()_+[]{}|;:,.<>?';

    function getSelectedCodeLength() {
        for (let radio of codeLengthRadios) {
            if (radio.checked) {
                return parseInt(radio.value);
            }
        }
        return null;
    }

    function generateRandomCode() {
        const choice = document.querySelector('input[name="charSet"]:checked').value; 
        const length = getSelectedCodeLength();

        if (isNaN(length) || length < 4 || length > 10) {
            alert("Invalid length! Please select a value between 4 and 10.");
            return;
        }

        let result = '';

        if (choice === 'numbers_only') {
            result = Array.from({ length }, () => DIGITS[Math.floor(Math.random() * DIGITS.length)]).join('');

        } else if (choice === 'alphabets_only') {
            result = Array.from({ length }, () => ASCII_LETTERS[Math.floor(Math.random() * ASCII_LETTERS.length)]).join('');

        } else if (choice === 'mixed') {
            let required = [
                DIGITS[Math.floor(Math.random() * DIGITS.length)],
                ASCII_LOWERCASE[Math.floor(Math.random() * ASCII_LOWERCASE.length)],
                ASCII_UPPERCASE[Math.floor(Math.random() * ASCII_UPPERCASE.length)]
            ];
            let remaining = length - required.length;
            let others = [];
            for (let i = 0; i < remaining; i++) {
                others.push(ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)]);
            }
            let full = required.concat(others);
            shuffleArray(full);
            result = full.join('');

        } else if (choice === 'mixed_special') {
            const charset = ALPHANUMERIC + SPECIAL_CHARS;
            result = Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
        }

        displayCode(result);
        copyBtn.disabled = false;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayCode(code) {
        generatedCodeDisplay.innerHTML = ''; 
        const span = document.createElement('span');
        span.classList.add('generated');
        span.textContent = code;
        generatedCodeDisplay.appendChild(span);
        generatedCodeDisplay.classList.add('generated');
    }

    function clearDisplay() {
        generatedCodeDisplay.innerHTML = '<p>Your generated code will appear here.</p>';
        generatedCodeDisplay.classList.remove('generated');
        copyBtn.disabled = true;
    }

    async function copyCodeToClipboard() {
        const codeElement = generatedCodeDisplay.querySelector('.generated');
        if (codeElement) {
            const code = codeElement.textContent;
            try {
                await navigator.clipboard.writeText(code);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Code';
                }, 2000);
            } catch (err) {
                alert('Failed to copy code. Please copy manually: ' + code);
            }
        }
    }
});
