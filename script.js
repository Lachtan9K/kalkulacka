// Načtení HTML prvků
const inputDisplay = document.getElementById('calculator-input');
const outputDisplay = document.getElementById('calculator-output');
const buttons = document.querySelectorAll('.calculator-buttons button');
const historyDisplay = document.getElementById('history-display');
const clearAllBtn = document.getElementById('clear-all-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Proměnné
let currentInput = '';
let lastResult = null;

// Funkce pro nahrazení exponentu ^ za Math.pow a vyhodnocení
function evaluateExpression(expr) {
  const expRegex = /(\d+\.?\d*|\([^\)]+\))\^(\d+\.?\d*|\([^\)]+\))/;

  while (expRegex.test(expr)) {
    expr = expr.replace(expRegex, 'Math.pow($1,$2)');
  }

  try {
    const result = Function(`"use strict"; return (${expr})`)();
    if (isNaN(result) || !isFinite(result)) throw new Error();
    return Number(result.toFixed(10)); // Omezíme přesnost
  } catch {
    return 'Chybný výraz';
  }
}

// Aktualizace displejů
function updateDisplays() {
  inputDisplay.textContent = currentInput || '0';
  outputDisplay.textContent = (lastResult !== null ? lastResult : '0');
}

// Přidání do historie
function addToHistory(expression, result) {
  const div = document.createElement('div');
  div.textContent = `${expression} = ${result}`;
  historyDisplay.prepend(div);
}

// Zpracování vstupu
function handleInput(val, id = '') {
  if (val === '=') {
    if (!currentInput) return;
    const result = evaluateExpression(currentInput);
    lastResult = result;
    addToHistory(currentInput, result);
    updateDisplays();
  } 
  else if (id === 'clear-btn') {
    currentInput = currentInput.slice(0, -1);
    updateDisplays();
  } 
  else if (id === 'clear-all-btn') {
    currentInput = '';
    lastResult = null;
    updateDisplays();
  } 
  else {
    currentInput += val;
    updateDisplays();
  }
}

// Tlačítka myší
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const val = button.value;
    const id = button.id;
    handleInput(val, id);
  });
});

// Klávesnice
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/[\d\+\-\*\/\(\)\.\^]/.test(key)) {
    currentInput += key;
    updateDisplays();
  } 
  else if (key === 'Enter') {
    e.preventDefault(); // Zamezí odeslání formuláře, pokud existuje
    handleInput('=');
  } 
  else if (key === 'Backspace') {
    handleInput('', 'clear-btn');
  } 
  else if (key === 'Escape') {
    handleInput('', 'clear-all-btn');
  }
});

// Výmaz historie
clearHistoryBtn.addEventListener('click', () => {
  historyDisplay.innerHTML = '';
});

// Inicializace
updateDisplays();
