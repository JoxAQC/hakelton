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
  
  // Remove ReactDOM.createRoot (legacy CRA mount — Next.js handles rendering)
  content = content.replace(/^ReactDOM\.createRoot[\s\S]*?\.render\(<App\s*\/>\);\s*$/gm, '');
  
  // Convert aliased React destructuring (e.g. const { useState: aUse } = React)
  content = content.replace(
    /const\s*{\s*([^}]+)\s*}\s*=\s*React\s*;/g,
    (match, inner) => {
      const parts = inner.split(',').map(s => s.trim());
      const lines = [];
      for (const part of parts) {
        if (part.includes(':')) {
          const [hook, name] = part.split(':').map(s => s.trim());
          lines.push(`const ${name} = ${hook};`);
        }
      }
      return lines.join('\n');
    }
  );
  
  // Remove any remaining plain React destructuring (hooks already imported at top)
  content = content.replace(/const\s*{\s*useState[^}]*}\s*=\s*React\s*;/g, '');

  finalCode += `\n/* --- ${file} --- */\n` + content;
}

finalCode += `\nexport default App;\nexport { DATA, loadSupabaseData };\n`;

// Replace window.DATA with module-level const (must run before window guards)
finalCode = finalCode.replace(/window\.DATA\s*=\s*/g, 'const DATA = ');
finalCode = finalCode.replace(/window\.DATA/g, 'DATA');

// Guard remaining top-level window assignments for SSR
finalCode = finalCode.replace(/^Object\.assign\(window,/gm, 'if (typeof window !== "undefined") Object.assign(window,');
finalCode = finalCode.replace(/^window\.(\w+)\s*=\s*/gm, 'if (typeof window !== "undefined") window.$1 = ');

// Guard top-level document mutations for SSR
finalCode = finalCode.replace(/^const __vp = document\.createElement/gm, 'let __vp; if (typeof document !== "undefined") { __vp = document.createElement');
finalCode = finalCode.replace(/^document\.head\.appendChild\(__vp\);/gm, 'document.head.appendChild(__vp); }');
finalCode = finalCode.replace(/^const __sp = document\.createElement/gm, 'let __sp; if (typeof document !== "undefined") { __sp = document.createElement');
finalCode = finalCode.replace(/^document\.head\.appendChild\(__sp\);/gm, 'document.head.appendChild(__sp); }');

// Safety net: strip any leftover ReactDOM mount line
finalCode = finalCode.replace(/^ReactDOM\.createRoot[\s\S]*?\.render\(<App\s*\/>\);\s*$/gm, '');

// Guard top-level document style injection for SSR
finalCode = finalCode.replace(
  /const (__\w+) = document\.createElement\("style"\);\n\1\.textContent = [^\n]+;\ndocument\.head\.appendChild\(\1\);/g,
  'if (typeof document !== "undefined") {\n$&\n}'
);

fs.writeFileSync(path.join(appDir, 'LegacyApp.jsx'), finalCode, 'utf-8');
console.log('LegacyApp.jsx created successfully.');

// Also copy styles.css to app/legacy-styles.css
fs.copyFileSync(path.join(uiDir, 'styles.css'), path.join(appDir, 'legacy-styles.css'));
console.log('legacy-styles.css copied successfully.');
