document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const PINLengthRadios = document.querySelectorAll('input[name="PINLength"]');
    const charSetRadios = document.querySelectorAll('input[name="charSet"]'); 
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const generatedPINDisplay = document.getElementById('generatedPINDisplay');
    const copyBtn = document.getElementById('copyBtn');

    // Event Listeners
    generateBtn.addEventListener('click', generateRandomPIN);
    clearBtn.addEventListener('click', clearDisplay);
    copyBtn.addEventListener('click', copyPINToClipboard);

    const DIGITS = '0123456789';
    const ASCII_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const ASCII_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const ASCII_LETTERS = ASCII_LOWERCASE + ASCII_UPPERCASE;
    const ALPHANUMERIC = ASCII_LETTERS + DIGITS;
    const SPECIAL_CHARS = '!@#$%^&*()_+[]{}|;:,.<>?';

    function getSelectedPINLength() {
        for (let radio of PINLengthRadios) {
            if (radio.checked) {
                return parseInt(radio.value);
            }
        }
        return null;
    }

    function generateRandomPIN() {
        const choice = document.querySelector('input[name="charSet"]:checked').value; 
        const length = getSelectedPINLength();

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

        displayPIN(result);
        copyBtn.disabled = false;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayPIN(PIN) {
        generatedPINDisplay.innerHTML = ''; 
        const span = document.createElement('span');
        span.classList.add('generated');
        span.textContent = PIN;
        generatedPINDisplay.appendChild(span);
        generatedPINDisplay.classList.add('generated');
    }

    function clearDisplay() {
        generatedPINDisplay.innerHTML = '<p>Your generated PIN will appear here.</p>';
        generatedPINDisplay.classList.remove('generated');
        copyBtn.disabled = true;
    }

    async function copyPINToClipboard() {
        const PINElement = generatedPINDisplay.querySelector('.generated');
        if (PINElement) {
            const PIN = PINElement.textContent;
            try {
                await navigator.clipboard.writeText(PIN);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy PIN';
                }, 2000);
            } catch (err) {
                alert('Failed to copy PIN. Please copy manually: ' + PIN);
            }
        }
    }
});
