const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, '../ui');
const appDir = path.join(__dirname, '../app');

const files = [
  'data.js',
  'tweaks-panel.jsx',
  'ui.jsx',
  'onboarding.jsx',
  'reports.jsx',
  'analytics.jsx',
  'importar.jsx',
  'app.jsx'
];

let finalCode = `"use client";\nimport React, { useState, useEffect, useRef, useMemo } from "react";\n\n`;

for (const file of files) {
  let content = fs.readFileSync(path.join(uiDir, file), 'utf-8');
  
  // Remove ReactDOM.createRoot
  content = content.replace(/ReactDOM\.createRoot\([^)]+\)\.render\(<App \/>\);/g, '');
  
  // Remove React imports/destructuring from individual files to avoid duplicates
  content = content.replace(/const\s*{\s*useState[^}]*}\s*=\s*React;/g, '');
  content = content.replace(/const\s*{\s*useState\s*:\s*aUse\s*}\s*=\s*React;/g, 'const aUse = useState;');

  finalCode += `\n/* --- ${file} --- */\n` + content;
}

finalCode += `\nexport default App;\n`;

// Let's also define window.DATA fallback if not in browser, though it's use client.
// We'll replace window.DATA = with const DATA = ... and then replace window.DATA everywhere with DATA.
finalCode = finalCode.replace(/window\.DATA\s*=\s*/g, 'const DATA = ');
finalCode = finalCode.replace(/window\.DATA/g, 'DATA');

fs.writeFileSync(path.join(appDir, 'LegacyApp.jsx'), finalCode, 'utf-8');
console.log('LegacyApp.jsx created successfully.');

// Also copy styles.css to app/legacy-styles.css
fs.copyFileSync(path.join(uiDir, 'styles.css'), path.join(appDir, 'legacy-styles.css'));
console.log('legacy-styles.css copied successfully.');
