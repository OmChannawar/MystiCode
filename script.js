// ================================
//  Supabase PIN Generator Script
//  Row-based Visitor Counter
// ================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ---- Supabase configuration ----
const SUPABASE_URL  = 'https://wobhtcllbfjvqmfuwxex.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvYmh0Y2xsYmZqdnFtZnV3eGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDMwMzAsImV4cCI6MjA2NDYxOTAzMH0.q-fqI5vHFPZZN5RG_sfnmVL2YD794dOg7SDPiMJxaf0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

document.addEventListener('DOMContentLoaded', () => {
  const DIGITS   = '0123456789';
  const LOWER    = 'abcdefghijklmnopqrstuvwxyz';
  const UPPER    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LETTERS  = LOWER + UPPER;
  const ALPHA    = LETTERS + DIGITS;
  const SPECIAL  = '!@#$%^&*()_+[]{}|;:,.<>?';

  const PINLengthRadios  = document.querySelectorAll('input[name="PINLength"]');
  const generateBtn      = document.getElementById('generateBtn');
  const clearBtn         = document.getElementById('clearBtn');
  const generatedDisplay = document.getElementById('generatedPINDisplay');
  const copyBtn          = document.getElementById('copyBtn');
  const visitorDisplay   = document.getElementById('visitorCount');

  updateVisitorCount();
  bindEvents();

  // ---------- Visitor Counter (row-based) ----------
  async function updateVisitorCount () {
    try {
      // 1️⃣ Insert a new row as a visit
      const { error: insertErr } = await supabase
        .from('visitors')
        .insert({}); // No columns

      if (insertErr) throw insertErr;

      // 2️⃣ Count all rows to get total visits
      const { count, error: countErr } = await supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true });

      if (countErr) throw countErr;

      // 3️⃣ Show result
      if (visitorDisplay)
        visitorDisplay.textContent = `🌐 Total visits: ${count}`;
    } catch (err) {
      console.error('Visitor count error:', err);
      if (visitorDisplay)
        visitorDisplay.textContent = '🌐 Visitors: Error loading';
    }
  }

  // ---------- Events ----------
  function bindEvents () {
    generateBtn.addEventListener('click', generatePIN);
    clearBtn  .addEventListener('click', clearDisplay);
    copyBtn   .addEventListener('click', copyToClipboard);
  }

  // ---------- PIN Generator ----------
  function getSelectedLength () {
    const r = [...PINLengthRadios].find(el => el.checked);
    return r ? +r.value : null;
  }

  function generatePIN () {
    const len  = getSelectedLength();
    const type = document.querySelector('input[name="charSet"]:checked')?.value;

    if (!len || len < 4 || len > 10) {
      alert('Choose a length between 4 and 10.');
      return;
    }

    let pin;
    switch (type) {
      case 'numbers_only':   pin = sample(DIGITS, len); break;
      case 'alphabets_only': pin = sample(LETTERS, len); break;
      case 'mixed':          pin = mixedPIN(len);        break;
      case 'mixed_special':  pin = sample(ALPHA + SPECIAL, len); break;
      default: alert('Select a character type.'); return;
    }

    showPIN(pin);
    copyBtn.disabled = false;
  }

  // ---------- Utility Functions ----------
  const rand   = set => set[Math.floor(Math.random() * set.length)];
  const sample = (set, n) => Array.from({ length: n }, () => rand(set)).join('');

  const mixedPIN = n => {
    const base = [rand(DIGITS), rand(LOWER), rand(UPPER)];
    const rest = Array.from({ length: n - base.length }, () => rand(ALPHA));
    return shuffle([...base, ...rest]).join('');
  };

  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  function showPIN (pin) {
    generatedDisplay.innerHTML = `<span class="generated">${pin}</span>`;
    generatedDisplay.classList.add('generated');
  }

  function clearDisplay () {
    generatedDisplay.innerHTML = '<p>Your generated PIN will appear here.</p>';
    generatedDisplay.classList.remove('generated');
    copyBtn.disabled = true;
  }

  async function copyToClipboard () {
    const span = generatedDisplay.querySelector('.generated');
    if (!span) return;

    try {
      await navigator.clipboard.writeText(span.textContent);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy PIN'; }, 2000);
    } catch {
      alert('Copy failed. Use Ctrl+C.');
    }
  }
});
