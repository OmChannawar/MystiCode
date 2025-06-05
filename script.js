// ================================
//  Supabase PIN Generator Script
//  Row‑based Visitor Counter (final)
// ================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ---- Supabase configuration ----
const SUPABASE_URL  = 'https://wobhtcllbfjvqmfuwxex.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvYmh0Y2xsYmZqdnFtZnV3eGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDMwMzAsImV4cCI6MjA2NDYxOTAzMH0.q-fqI5vHFPZZN5RG_sfnmVL2YD794dOg7SDPiMJxaf0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

/* -------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Character sets
  const DIGITS  = '0123456789';
  const LOWER   = 'abcdefghijklmnopqrstuvwxyz';
  const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LETTERS = LOWER + UPPER;
  const ALPHA   = LETTERS + DIGITS;
  const SPECIAL = '!@#$%^&*()_+[]{}|;:,.<>?';

  // DOM refs
  const PINLengthRadios  = document.querySelectorAll('input[name="PINLength"]');
  const generateBtn      = document.getElementById('generateBtn');
  const clearBtn         = document.getElementById('clearBtn');
  const generatedDisplay = document.getElementById('generatedPINDisplay');
  const copyBtn          = document.getElementById('copyBtn');
  const visitorDisplay   = document.getElementById('visitorCount');

  // Init
  updateVisitorCount();
  bindEvents();

  /* ---------- Visitor counter (row-based, Supabase v2) ---------- */
async function updateVisitorCount () {
  try {
    // 1️⃣ Insert an empty row → log visit
    const { error: insertErr } = await supabase
        .from('visits')  // ✅ match the table name from Supabase
        .insert([{}], { returning: 'minimal' });     // ← array form
    if (insertErr) console.error('Insert failed:', insertErr);

    // 2️⃣ Count rows → total visits
    const { count, error: countErr } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true }); // returns { data:null, count }
    if (countErr) throw countErr;

    visitorDisplay.textContent = `🌐 Total visits: ${count}`;
  } catch (err) {
    console.error('Visitor counter error:', err);
    visitorDisplay.textContent = '🌐 Visitors: Error loading';
  }
}

  /* ---------- Event bindings ---------- */
  function bindEvents () {
    generateBtn.addEventListener('click', generatePIN);
    clearBtn  .addEventListener('click', clearDisplay);
    copyBtn   .addEventListener('click', copyToClipboard);
  }

  /* ---------- PIN generator ---------- */
  function getSelectedLength () {
    const el = [...PINLengthRadios].find(r => r.checked);
    return el ? +el.value : null;
  }

  function generatePIN () {
    const len  = getSelectedLength();
    const type = document.querySelector('input[name="charSet"]:checked')?.value;

    if (!len || len < 4 || len > 10) {
      alert('Choose a length between 4 and 10.');
      return;
    }

    const pin = ({
      numbers_only   : () => sample(DIGITS, len),
      alphabets_only : () => sample(LETTERS, len),
      mixed          : () => mixedPIN(len),
      mixed_special  : () => sample(ALPHA + SPECIAL, len)
    }[type] || (() => ''))();

    if (!pin) { alert('Select a character type.'); return; }

    showPIN(pin);
    copyBtn.disabled = false;
  }

  /* ---------- Utility helpers ---------- */
  const rand   = set => set[Math.random() * set.length | 0];
  const sample = (set, n) => Array.from({ length: n }, () => rand(set)).join('');

  const mixedPIN = n => {
    const base = [rand(DIGITS), rand(LOWER), rand(UPPER)];
    const rest = Array.from({ length: n - base.length }, () => rand(ALPHA));
    return shuffle([...base, ...rest]).join('');
  };

  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.random() * (i + 1) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  /* ---------- UI helpers ---------- */
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
      setTimeout(() => (copyBtn.textContent = 'Copy PIN'), 2000);
    } catch {
      alert('Copy failed. Use Ctrl+C.');
    }
  }
});
