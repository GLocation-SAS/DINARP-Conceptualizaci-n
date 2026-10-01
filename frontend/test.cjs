const fs = require('fs');

function extractTags(str, tagName) {
  let tags = [];
  let idx = 0;
  while ((idx = str.indexOf('<' + tagName, idx)) !== -1) {
     let i = idx + tagName.length;
     console.log('Found', tagName, 'at', idx, 'char after:', str[i]);
     if (str[i] !== ' ' && str[i] !== '\n' && str[i] !== '\r' && str[i] !== '>' && str[i] !== '/') {
        idx = i;
        console.log('Skipping because not a boundary');
        continue;
     }
     let inQuote = null;
     let braceLevel = 0;
     while (i < str.length) {
       let c = str[i];
       if (inQuote) {
         if (c === inQuote) inQuote = null;
       } else if (braceLevel > 0) {
         if (c === '{') braceLevel++;
         else if (c === '}') braceLevel--;
       } else {
         if (c === '"' || c === "'") inQuote = c;
         else if (c === '{') braceLevel++;
         else if (c === '>' || (c === '/' && str[i+1] === '>')) {
           let endIdx = c === '>' ? i + 1 : i + 2;
           tags.push({ start: idx, end: endIdx, content: str.substring(idx, endIdx) });
           console.log('Pushed tag, endIdx:', endIdx);
           idx = endIdx;
           break;
         }
       }
       i++;
     }
     if (i >= str.length) {
        break;
     }
  }
  return tags;
}

let c = fs.readFileSync('src/app/wireframes2/cambio-coordinador/page.tsx', 'utf8');
let cells = extractTags(c, 'TableCell');
console.log('cells length', cells.length);
