// src/utils/hybridParseToHTML.js
import renderMiniMessageToHtml from './renderMiniMessageToHtml';

const colorMap = {
    "0": "#000000","1": "#0000AA","2": "#00AA00","3": "#00AAAA",
    "4": "#AA0000","5": "#AA00AA","6": "#FFAA00","7": "#AAAAAA",
    "8": "#555555","9": "#5555FF","a": "#55FF55","b": "#55FFFF",
    "c": "#FF5555","d": "#FF55FF","e": "#FFFF55","f": "#FFFFFF"
};

const formattingMap = {
    l: 'font-bold',
    n: 'underline',
    o: 'italic',
    m: 'line-through',
    k: 'obfuscated',
};

function parseLegacyCodes(line) {
    let output = '', openTags = [], i = 0;
    while (i < line.length) {
        if (line[i] === '&' && i + 1 < line.length) {
            const code = line[i+1].toLowerCase();
            if (colorMap[code]) {
                output += `<span style="color:${colorMap[code]}">`;
                openTags.push('</span>');
                i += 2; continue;
            }
            if (formattingMap[code]) {
                // for &k we want data-obfuscated, for others we don’t need it
                const extra = code === 'k' ? ' data-obfuscated' : '';
                output += `<span class="${formattingMap[code]}"${extra}>`;
                openTags.push('</span>');
                i += 2;
                continue;
            }

            if (code === 'r') {
                while (openTags.length) output += openTags.pop();
                i += 2; continue;
            }
        }
        output += line[i++];
    }
    while (openTags.length) output += openTags.pop();
    return output;
}

export default function hybridParseToHTML(text) {
    if (!text) return '';
    return text
        .split('\n')
        .map(line => {
            // if the line contains a MiniMessage tag → use that parser
            if (/<\/?[a-z_]+(:[^>]+)?>/i.test(line)) {
                return renderMiniMessageToHtml(line);
            }
            // otherwise fallback to legacy &-code parsing
            return parseLegacyCodes(line);
        })
        .join('<br>');
}
