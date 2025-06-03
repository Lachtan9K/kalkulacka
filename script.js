const inputDisplay = document.getElementById('calculator-input');
const outputDisplay = document.getElementById('calculator-output');
const buttons = document.querySelectorAll('.calculator-buttons button');
const historyDisplay = document.getElementById('history-display');
const clearAllBtn = document.getElementById('clear-all-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

let currentInput = '';
let lastResult = null; // ukládá poslední výsledek

// Funkce pro nahrazení exponentu ^ za Math.pow a vyhodnocení
function evaluateExpression(expr) {
  const expRegex = /(\d+\.?\d*|\([^\)]+\))\^(\d+\.?\d*|\([^\)]+\))/;

  while (expRegex.test(expr)) {
    expr = expr.replace(expRegex, 'Math.pow($1,$2)');
  }

  try {
    return Function(`"use strict"; return (${expr})`)();
  } catch {
    return 'Chybný výraz';
  }
}

function updateDisplays() {
  inputDisplay.textContent = currentInput || '0';
  outputDisplay.textContent = lastResult !== null ? lastResult : '0';
}

function addToHistory(expression, result) {
  const div = document.createElement('div');
  div.textContent = `${expression} = ${result}`;
  historyDisplay.prepend(div);
}

// Zpracování tlačítek
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const val = button.value;
    const id = button.id;

    if (val === '=') {
      if (!currentInput) return;
      const result = evaluateExpression(currentInput);
      lastResult = result;
      outputDisplay.textContent = result;
      addToHistory(currentInput, result);
      // NEZMĚŇUJ currentInput, nech jej v původním stavu
      updateDisplays();
    } else if (id === 'clear-btn') {
      // Vymazat poslední znak (C)
      currentInput = currentInput.slice(0, -1);
      updateDisplays();
    } else if (id === 'clear-all-btn') {
      // Vymazat vše (CE)
      currentInput = '';
      lastResult = null;
      updateDisplays();
    } else {
      // Přidat znak
      currentInput += val;
      updateDisplays();
    }
  });
});

// Vymazat historii
clearHistoryBtn.addEventListener('click', () => {
  historyDisplay.innerHTML = '';
});

// Inicializace displeje
updateDisplays();
