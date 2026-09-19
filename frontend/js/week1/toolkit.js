/**
 * DecodeLabs Project 1: Intern Survival Toolkit & Learning Vault Controller
 * Implements interactive VS Code shortcuts simulator and Domain Vault filters.
 */

export function initToolkit() {
  initVSCodeSimulator();
  initLearningVault();
}

function initVSCodeSimulator() {
  const terminalOutput = document.getElementById('terminal-output');
  const shortcutButtons = document.querySelectorAll('.shortcut-key-btn');
  const clearTerminalBtn = document.getElementById('btn-clear-terminal');

  const SHORTCUT_ACTIONS = {
    terminal: {
      keys: 'Ctrl + ~',
      desc: 'Opens the Terminal instantly',
      output: [
        'powershell> [Decodelabs CLI v2026.1] Initialized in ~/decodelabs-intern-project1',
        'powershell> All semantic checks passing. Grid floor-plan active.',
        'powershell> Terminal ready for developer input.'
      ]
    },
    comment: {
      keys: 'Ctrl + /',
      desc: 'Comment / Uncomment multiple lines',
      output: [
        '/* [DEV COMMENT APPLIED] */',
        '// <section class="grid-macro-layout" aria-label="Hero Container">',
        '// Modern CSS Grid 2D architecture confirmed active.'
      ]
    },
    format: {
      keys: 'Shift + Alt + F',
      desc: 'Auto-format messy code (Life saver!)',
      output: [
        'formatting> Running Prettier/CodeBeautifier engine...',
        'formatting> ✓ Indentation aligned (2 spaces)',
        'formatting> ✓ CSS clamp variables normalized',
        'formatting> ✓ Zero lint errors detected.'
      ]
    },
    quickopen: {
      keys: 'Ctrl + P',
      desc: 'Find any file in your project instantly',
      output: [
        'search> Quick Open: > index.html',
        'search> Results: [1] index.html, [2] css/layout.css, [3] js/simulator.js',
        'search> Jumping to active line 1...'
      ]
    }
  };

  function appendTerminalLogs(actionKey) {
    if (!terminalOutput || !SHORTCUT_ACTIONS[actionKey]) return;

    const action = SHORTCUT_ACTIONS[actionKey];
    
    // Add command echo line
    const promptLine = document.createElement('div');
    promptLine.className = 'terminal-line';
    promptLine.innerHTML = `<span class="terminal-prompt">intern@decodelabs:~$</span> <span class="terminal-highlight">${action.keys}</span> <span class="terminal-text">— ${action.desc}</span>`;
    terminalOutput.appendChild(promptLine);

    // Add log results
    action.output.forEach(text => {
      const resLine = document.createElement('div');
      resLine.className = 'terminal-line';
      resLine.innerHTML = `<span class="terminal-success">></span> <span class="terminal-text">${text}</span>`;
      terminalOutput.appendChild(resLine);
    });

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  shortcutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      shortcutButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appendTerminalLogs(action);
    });
  });

  if (clearTerminalBtn && terminalOutput) {
    clearTerminalBtn.addEventListener('click', () => {
      terminalOutput.innerHTML = `<div class="terminal-line"><span class="terminal-prompt">intern@decodelabs:~$</span> <span class="terminal-text">Terminal cleared. Press any shortcut above or on your keyboard.</span></div>`;
    });
  }

  // Global physical keyboard listener
  window.addEventListener('keydown', (e) => {
    // Ctrl + ~ or Ctrl + `
    if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '~')) {
      e.preventDefault();
      appendTerminalLogs('terminal');
    }
    // Ctrl + /
    else if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      appendTerminalLogs('comment');
    }
    // Shift + Alt + F
    else if (e.shiftKey && e.altKey && (e.key === 'f' || e.key === 'F')) {
      e.preventDefault();
      appendTerminalLogs('format');
    }
    // Ctrl + P
    else if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      // Avoid printing in browser if focused inside simulator area
      if (document.activeElement.closest('.vscode-simulator')) {
        e.preventDefault();
        appendTerminalLogs('quickopen');
      }
    }
  });
}

function initLearningVault() {
  const vaultTabs = document.querySelectorAll('.vault-tab');
  const vaultPanels = document.querySelectorAll('.vault-panel');

  vaultTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetDomain = tab.dataset.target;

      vaultTabs.forEach(t => t.classList.remove('active'));
      vaultPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.getElementById(`vault-${targetDomain}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}
