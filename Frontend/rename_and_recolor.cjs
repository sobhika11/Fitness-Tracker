const fs = require('fs');
const path = require('path');

// 1. Rename FITORA to FITSYNC
const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
const changedFiles = [];

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('FITORA')) {
    content = content.replace(/FITORA/g, 'FITSYNC');
    fs.writeFileSync(filePath, content);
    changedFiles.push(file);
  }
});
console.log('Renamed in:', changedFiles.join(', '));

// 2. Recolor index.css
const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const replacements = [
  { target: /#0c0c0c/gi, replacement: '#4a4345' },
  { target: /#481e14/gi, replacement: '#836871' },
  { target: /#9b3922/gi, replacement: '#A37E84' },
  { target: /#f2613f/gi, replacement: '#CDADAB' },
  { target: /#f6eee9/gi, replacement: '#EBD7CE' },
  { target: /#fdf8f4/gi, replacement: '#f4e8e3' },
  { target: /#6d4b42/gi, replacement: '#917F88' },
  { target: /rgba\(\s*72\s*,\s*30\s*,\s*20\s*,/g, replacement: 'rgba(131, 104, 113,' },
  { target: /rgba\(\s*242\s*,\s*97\s*,\s*63\s*,/g, replacement: 'rgba(205, 173, 171,' },
  { target: /rgba\(\s*155\s*,\s*57\s*,\s*34\s*,/g, replacement: 'rgba(163, 126, 132,' },
  { target: /#f2e7e1/gi, replacement: '#e8d0c6' },
  { target: /#efe3dc/gi, replacement: '#e4cac1' },
  { target: /#fffdfa/gi, replacement: '#f9f2ef' },
  { target: /#b1988f/gi, replacement: '#bdaab2' },
  { target: /#f8f3ef/gi, replacement: '#f0dfd6' },
  { target: /#e35a39/gi, replacement: '#c09c9b' },
  { target: /#f9efe8/gi, replacement: '#ede0da' },
  { target: /#ffede6/gi, replacement: '#ebdbe0' },
  { target: /#fdf5f0/gi, replacement: '#faebf0' },
  { target: /#f4f1ec/gi, replacement: '#eee7e9' }
];

replacements.forEach(({target, replacement}) => {
  css = css.replace(target, replacement);
});

fs.writeFileSync(cssPath, css);
console.log('CSS recolored successfully.');
