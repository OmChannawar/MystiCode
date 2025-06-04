document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const DIGITS = '0123456789';
    const ASCII_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const ASCII_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const ASCII_LETTERS = ASCII_LOWERCASE + ASCII_UPPERCASE;
    const ALPHANUMERIC = ASCII_LETTERS + DIGITS;
    const SPECIAL_CHARS = '!@#$%^&*()_+[]{}|;:,.<>?';

    // DOM Elements
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

    function getSelectedPINLength() {
        const selected = [...PINLengthRadios].find(radio => radio.checked);
        return selected ? parseInt(selected.value) : null;
    }

    function generateRandomPIN() {
        const length = getSelectedPINLength();
        const choice = document.querySelector('input[name="charSet"]:checked')?.value;

        if (!length || length < 4 || length > 10) {
            alert("Invalid length! Please select a value between 4 and 10.");
            return;
        }

        let result = '';

        switch (choice) {
            case 'numbers_only':
                result = generateFromCharset(DIGITS, length);
                break;

            case 'alphabets_only':
                result = generateFromCharset(ASCII_LETTERS, length);
                break;

            case 'mixed':
                result = generateMixedPIN(length);
                break;

            case 'mixed_special':
                result = generateFromCharset(ALPHANUMERIC + SPECIAL_CHARS, length);
                break;

            default:
                alert("Please select a valid character set option.");
                return;
        }

        displayPIN(result);
        copyBtn.disabled = false;
    }

    function generateFromCharset(charset, length) {
        return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
    }

    function generateMixedPIN(length) {
        const required = [
            randomChar(DIGITS),
            randomChar(ASCII_LOWERCASE),
            randomChar(ASCII_UPPERCASE)
        ];
        const remaining = Array.from(
            { length: length - required.length },
            () => randomChar(ALPHANUMERIC)
        );
        const all = shuffleArray([...required, ...remaining]);
        return all.join('');
    }

    function randomChar(charset) {
        return charset[Math.floor(Math.random() * charset.length)];
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
        if (!PINElement) return;

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
});
