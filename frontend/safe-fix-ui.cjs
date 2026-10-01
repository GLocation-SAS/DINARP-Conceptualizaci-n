const fs = require('fs');
const glob = require('glob');

function extractTags(str, tagName) {
  let tags = [];
  let idx = 0;
  while ((idx = str.indexOf('<' + tagName, idx)) !== -1) {
     let i = idx + tagName.length + 1;
     if (str[i] !== ' ' && str[i] !== '\n' && str[i] !== '\r' && str[i] !== '>' && str[i] !== '/') {
        idx = i;
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
           idx = endIdx;
           break;
         }
       }
       i++;
     }
     if (i >= str.length) break;
  }
  return tags;
}

const files = glob.sync('src/app/wireframes2/**/*.tsx');
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  let cells = extractTags(content, 'TableCell');
  let offset = 0;
  for (let c of cells) {
     let closeIdx = content.indexOf('</TableCell>', c.start + offset);
     if (closeIdx === -1) continue;
     
     let innerCell = content.substring(c.start + offset, closeIdx);
     
     if (innerCell.includes('<Button')) {
        let openTagEnd = innerCell.indexOf('>');
        let openTagStr = innerCell.substring(0, openTagEnd + 1);
        
        let innerBody = innerCell.substring(openTagEnd + 1);
        
        let buttons = extractTags(innerBody, 'Button');
        let localOffset = 0;
        for (let b of buttons) {
           let bCloseIdx = innerBody.indexOf('</Button>', b.start + localOffset);
           if (bCloseIdx !== -1) {
              let btnStr = innerBody.substring(b.start + localOffset, bCloseIdx + 9);
              let openTag = b.content;
              if (openTag.includes('size="icon-sm"')) {
                 let btnInnerStart = openTag.length;
                 let btnInnerEnd = btnStr.length - 9;
                 let btnInner = btnStr.substring(btnInnerStart, btnInnerEnd);
                 
                 // Remove exact text spans
                 btnInner = btnInner.replace(/<span[^>]*>\s*Ver credenciales\s*<\/span>/g, '');
                 btnInner = btnInner.replace(/<span[^>]*>\s*Ver detalle\s*<\/span>/g, '');
                 btnInner = btnInner.replace(/<span[^>]*>\s*Asignar revisor\s*<\/span>/g, '');
                 btnInner = btnInner.replace(/<span[^>]*>\s*Ver\s*<\/span>/g, '');
                 btnInner = btnInner.replace(/<span[^>]*>\s*Gestionar\s*<\/span>/g, '');
                 btnInner = btnInner.replace(/<span[^>]*>\s*Resolución\s*<\/span>/g, '');
                 
                 // Remove trailing text
                 btnInner = btnInner.replace(/>\s*Asignar revisor\s*$/g, '>');
                 btnInner = btnInner.replace(/>\s*Ver detalle\s*$/g, '>');
                 btnInner = btnInner.replace(/>\s*Ver credenciales\s*$/g, '>');
                 btnInner = btnInner.replace(/>\s*Ver\s*$/g, '>');
                 btnInner = btnInner.replace(/>\s*Gestionar\s*$/g, '>');
                 btnInner = btnInner.replace(/>\s*Resolución\s*$/g, '>');
                 
                 // Remove leading text
                 btnInner = btnInner.replace(/^\s*Asignar revisor\s*/g, '');
                 btnInner = btnInner.replace(/^\s*Ver detalle\s*/g, '');
                 btnInner = btnInner.replace(/^\s*Ver credenciales\s*/g, '');
                 btnInner = btnInner.replace(/^\s*Ver\s*/g, '');
                 btnInner = btnInner.replace(/^\s*Gestionar\s*/g, '');
                 btnInner = btnInner.replace(/^\s*Resolución\s*/g, '');
                 
                 // Also handle pure text replacement safely without killing JSX
                 btnInner = btnInner.replace(/>\s*Asignar revisor\s*</g, '><');
                 btnInner = btnInner.replace(/>\s*Ver detalle\s*</g, '><');
                 btnInner = btnInner.replace(/>\s*Ver credenciales\s*</g, '><');
                 btnInner = btnInner.replace(/>\s*Ver\s*</g, '><');
                 btnInner = btnInner.replace(/>\s*Gestionar\s*</g, '><');
                 btnInner = btnInner.replace(/>\s*Resolución\s*</g, '><');
                 
                 let newBtnStr = openTag + btnInner + '</Button>';
                 if (newBtnStr !== btnStr) {
                    innerBody = innerBody.substring(0, b.start + localOffset) + newBtnStr + innerBody.substring(b.start + localOffset + btnStr.length);
                    localOffset += newBtnStr.length - btnStr.length;
                 }
              }
           }
        }
        
        let newCell = openTagStr + innerBody;
        if (newCell !== innerCell) {
           content = content.substring(0, c.start + offset) + newCell + content.substring(closeIdx);
           offset += newCell.length - innerCell.length;
        }
     }
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Fixed', file);
  }
}
console.log('Modified files:', modifiedCount);
