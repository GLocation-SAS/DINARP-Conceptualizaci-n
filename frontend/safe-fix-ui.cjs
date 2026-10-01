const fs = require('fs');
const glob = require('glob');

function extractTags(str, tagName) {
  let tags = [];
  let idx = 0;
  while ((idx = str.indexOf('<' + tagName, idx)) !== -1) {
     let i = idx + tagName.length + 1;
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

function replaceTags(str, tags, replaceFn) {
  let offset = 0;
  for (let tag of tags) {
    let oldContent = tag.content;
    let newContent = replaceFn(oldContent);
    if (oldContent !== newContent) {
      str = str.substring(0, tag.start + offset) + newContent + str.substring(tag.end + offset);
      offset += newContent.length - oldContent.length;
    }
  }
  return str;
}

function parseTag(tagStr) {
  const tagNameMatch = tagStr.match(/^<([a-zA-Z0-9_-]+)/);
  if (!tagNameMatch) return null;
  const tagName = tagNameMatch[1];
  
  const attrs = [];
  let i = tagName.length + 1;
  while (i < tagStr.length) {
    while (i < tagStr.length && /\s|\n|\r/.test(tagStr[i])) i++;
    if (i >= tagStr.length || tagStr[i] === '>' || (tagStr[i] === '/' && tagStr[i+1] === '>')) break;
    
    let attrStart = i;
    while (i < tagStr.length && tagStr[i] !== '=' && !/\s|\n|\r/.test(tagStr[i]) && tagStr[i] !== '>' && tagStr[i] !== '/') i++;
    let attrName = tagStr.substring(attrStart, i);
    
    let attrValue = null;
    let isBrace = false;
    
    while (i < tagStr.length && /\s|\n|\r/.test(tagStr[i])) i++;
    
    if (tagStr[i] === '=') {
      i++;
      while (i < tagStr.length && /\s|\n|\r/.test(tagStr[i])) i++;
      let char = tagStr[i];
      if (char === '"' || char === "'") {
        let quote = char;
        i++;
        let valStart = i;
        while (i < tagStr.length && tagStr[i] !== quote) i++;
        attrValue = tagStr.substring(valStart, i);
        i++; // skip quote
      } else if (char === '{') {
        isBrace = true;
        let braceCount = 1;
        i++;
        let valStart = i;
        while (i < tagStr.length && braceCount > 0) {
          if (tagStr[i] === '{') braceCount++;
          if (tagStr[i] === '}') braceCount--;
          i++;
        }
        attrValue = tagStr.substring(valStart, i - 1);
      } else {
        let valStart = i;
        while (i < tagStr.length && !/\s|\n|\r/.test(tagStr[i]) && tagStr[i] !== '>' && tagStr[i] !== '/') i++;
        attrValue = tagStr.substring(valStart, i);
      }
    }
    attrs.push({ name: attrName, value: attrValue, isBrace });
  }
  
  let isSelfClosing = tagStr.endsWith('/>') || tagStr.endsWith('/ >');
  return { tagName, attrs, isSelfClosing };
}

function stringifyTag(parsed) {
  let str = `<${parsed.tagName}`;
  for (const attr of parsed.attrs) {
    if (attr.value === null) {
      str += ` ${attr.name}`;
    } else {
      if (attr.isBrace) {
         str += ` ${attr.name}={${attr.value}}`;
      } else {
         str += ` ${attr.name}="${attr.value}"`;
      }
    }
  }
  str += parsed.isSelfClosing ? ' />' : '>';
  return str;
}

const files = glob.sync('src/app/wireframes2/**/*.tsx');
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Fix TableHead
  content = content.replace(/<TableHead([^>]*)>(?:\s*|\{?\s*\/\*.*?\*\/\s*\}?\s*)(ACCIONES|Acciones)(?:\s*|\{?\s*\/\*.*?\*\/\s*\}?\s*)<\/TableHead>/g, '<TableHead className="w-24 text-center">Acciones</TableHead>');

  // 2. Fix TableCells containing Button tags
  let cells = extractTags(content, 'TableCell');
  let offset = 0;
  for (let c of cells) {
     let closeIdx = content.indexOf('</TableCell>', c.start + offset);
     if (closeIdx === -1) continue;
     
     let innerCell = content.substring(c.start + offset, closeIdx);
     
     if (innerCell.includes('<Button')) {
        let openTagEnd = innerCell.indexOf('>');
        let openTagStr = innerCell.substring(0, openTagEnd + 1);
        
        let parsedOpenTag = parseTag(openTagStr);
        if (parsedOpenTag) {
           let classAttr = parsedOpenTag.attrs.find(a => a.name === 'className');
           if (classAttr) {
              if (classAttr.value && typeof classAttr.value === 'string' && !classAttr.isBrace) {
                 classAttr.value = classAttr.value.replace(/text-right|text-left/, 'text-center');
                 if (!classAttr.value.includes('text-center')) classAttr.value += ' text-center';
                 classAttr.value = classAttr.value.replace(/\bpx-\d(\.\d)?\b/, '');
                 classAttr.value = classAttr.value.replace(/\s+/g, ' ').trim();
              }
           } else {
              parsedOpenTag.attrs.push({ name: 'className', value: 'text-center', isBrace: false });
           }
           openTagStr = stringifyTag(parsedOpenTag);
        }
        
        let innerBody = innerCell.substring(openTagEnd + 1);
        
        // Fix div layout
        let divs = extractTags(innerBody, 'div');
        innerBody = replaceTags(innerBody, divs, (divMatch) => {
           let parsed = parseTag(divMatch);
           if (!parsed) return divMatch;
           let classAttr = parsed.attrs.find(a => a.name === 'className');
           if (classAttr && classAttr.value && typeof classAttr.value === 'string' && !classAttr.isBrace && classAttr.value.includes('flex')) {
              let cls = classAttr.value;
              cls = cls.replace(/justify-(end|between|right)/, 'justify-center');
              if (!cls.includes('justify-center')) cls += ' justify-center';
              cls = cls.replace(/gap-\d(\.\d)?/, 'gap-3');
              if (!cls.includes('gap-3')) cls += ' gap-3';
              cls = cls.replace(/\bshrink-0\b/, '');
              classAttr.value = cls.replace(/\s+/g, ' ').trim();
              return stringifyTag(parsed);
           }
           return divMatch;
        });
        
        // Fix Buttons
        let buttons = extractTags(innerBody, 'Button');
        innerBody = replaceTags(innerBody, buttons, (btnMatch) => {
           let parsed = parseTag(btnMatch);
           if (!parsed) return btnMatch;
           
           let intent = 'primary-300';
           let oldClassAttr = parsed.attrs.find(a => a.name === 'className');
           let oldVariant = parsed.attrs.find(a => a.name === 'variant');
           let oldVal = ((oldClassAttr && typeof oldClassAttr.value === 'string' ? oldClassAttr.value : '') + ' ' + (oldVariant && typeof oldVariant.value === 'string' ? oldVariant.value : '')).toLowerCase();
           
           if (oldVal.includes('danger') || oldVal.includes('trash') || oldVal.includes('baja') || oldVal.includes('rechazar')) intent = 'danger';
           else if (oldVal.includes('warning') || oldVal.includes('ban') || oldVal.includes('suspender')) intent = 'warning';
           else if (oldVal.includes('success') || oldVal.includes('check') || oldVal.includes('aprobar') || oldVal.includes('completar')) intent = 'success';
           
           let colorClass = 'text-muted-foreground hover:text-primary-300 hover:bg-primary-300/10';
           if (intent === 'danger') colorClass = 'text-muted-foreground hover:text-danger hover:bg-danger/10';
           if (intent === 'success') colorClass = 'text-muted-foreground hover:text-success hover:bg-success/10';
           if (intent === 'warning') colorClass = 'text-muted-foreground hover:text-warning hover:bg-warning/10';
           
           let newAttrs = parsed.attrs.filter(a => !['variant', 'size', 'className'].includes(a.name));
           
           newAttrs.push({ name: 'variant', value: 'ghost', isBrace: false });
           newAttrs.push({ name: 'size', value: 'icon-sm', isBrace: false });
           newAttrs.push({ name: 'className', value: colorClass, isBrace: false });
           
           parsed.attrs = newAttrs;
           return stringifyTag(parsed);
        });
        
        // Icons are harder to extract by generic name without regex, but we can just use simple regex for empty tags
        innerBody = innerBody.replace(/<([A-Z][a-zA-Z0-9]+)\s+[^>]*\/>/g, (iconMatch, tagName) => {
           const ignoredTags = ['Button', 'Tooltip', 'TooltipTrigger', 'TooltipContent', 'TooltipProvider', 'Link', 'DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuSeparator', 'DropdownMenuGroup', 'TableHead', 'TableRow', 'TableCell', 'Badge', 'Alert', 'AlertTitle', 'AlertDescription', 'Dialog', 'DialogTrigger', 'DialogContent', 'DropdownMenuLabel', 'DialogHeader', 'DialogTitle', 'DialogDescription'];
           if (ignoredTags.includes(tagName) || tagName.endsWith('Icon')) return iconMatch;
           
           let parsed = parseTag(iconMatch);
           if (!parsed) return iconMatch;
           let newAttrs = parsed.attrs.filter(a => a.name !== 'className');
           newAttrs.push({ name: 'className', value: 'size-4', isBrace: false });
           parsed.attrs = newAttrs;
           parsed.isSelfClosing = true;
           return stringifyTag(parsed);
        });
        
        let newCell = openTagStr + innerBody;
        content = content.substring(0, c.start + offset) + newCell + content.substring(closeIdx);
        offset += newCell.length - innerCell.length;
     }
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Fixed', file);
  }
}
console.log('Modified files:', modifiedCount);
