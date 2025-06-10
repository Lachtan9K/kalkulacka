//Načtení HTML prvků
const inputDisplay = document.getElementById('calculator-input');
const outputDisplay = document.getElementById('calculator-output');
const buttons = document.querySelectorAll('.calculator-buttons button');
const historyDisplay = document.getElementById('history-display');
const clearAllBtn = document.getElementById('clear-all-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');


//Proměnné let
let currentInput = '';
let lastResult = null; // ukládá poslední výsledek

// Funkce pro nahrazení exponentu ^ za Math.pow a vyhodnocení. 
// JavaScript nezná ^ jako "umocni", ale jako bitový operátor. 
// Proto se a^b musí nahradit za Math.pow(a, b).

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

//Vždy bude nula na obrazovkách i po smazání výsledků. Aktualizace displejů.
function updateDisplays() {
  inputDisplay.textContent = currentInput || '0';
  outputDisplay.textContent = lastResult !== null ? lastResult : '0';
}

//Přidávání výpočtů do historie.
function addToHistory(expression, result) {
  const div = document.createElement('div');
  div.textContent = `${expression} = ${result}`;
  historyDisplay.prepend(div);
}

// Zpracování tlačítek, reakce.
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
    } 
    
    else if (id === 'clear-btn') {
      // Vymaže poslední napsaný znak (C)
      currentInput = currentInput.slice(0, -1);
      updateDisplays();
    } 
    
    else if (id === 'clear-all-btn') {
      // Vymazat vše ze vstupy i z výstupu (CE)
      currentInput = '';
      lastResult = null;
      updateDisplays();
    } 
    
    else {
      // Přidat znak
      currentInput += val;
      updateDisplays();
    }
  });
});

//Výmaz historie
clearHistoryBtn.addEventListener('click', () => {
  historyDisplay.innerHTML = '';
});

// Inicializace displeje, Vždy bude NULA.
updateDisplays();