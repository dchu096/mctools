// src/utils/renderMiniMessageToHtml.js

const namedColors = {
    black:        "#000000",
    dark_blue:    "#0000AA",
    dark_green:   "#00AA00",
    dark_aqua:    "#00AAAA",
    dark_red:     "#AA0000",
    dark_purple:  "#AA00AA",
    gold:         "#FFAA00",
    gray:         "#AAAAAA",
    dark_gray:    "#555555",
    blue:         "#5555FF",
    green:        "#55FF55",
    aqua:         "#55FFFF",
    red:          "#FF5555",
    light_purple: "#FF55FF",
    yellow:       "#FFFF55",
    white:        "#FFFFFF",
};

export default function renderMiniMessageToHtml(text) {
    // ————————————————————————————
    // 1) Rainbow pre‑pass
    // ————————————————————————————
    text = text.replace(
        /<rainbow(?::(!)?(\d+))?>([\s\S]*?)<\/rainbow>/gi,
        (_, bang, phaseRaw, content) => {
            // base rainbow colors
            let colors = [
                "#FF0000", // red
                "#FF7F00", // orange
                "#FFFF00", // yellow
                "#00FF00", // green
                "#0000FF", // blue
                "#4B0082", // indigo
                "#8B00FF"  // violet
            ];

            // reverse if "!"
            if (bang) colors.reverse();

            // rotate by phase (integer)
            if (phaseRaw) {
                const shift = parseInt(phaseRaw, 10) % colors.length;
                colors = colors.slice(shift).concat(colors.slice(0, shift));
            }

            const gradientCss = `linear-gradient(90deg, ${colors.join(", ")})`;
            return `<span style="
        background: ${gradientCss};
        -webkit-background-clip: text;
        color: transparent;
      ">${content}</span>`;
        }
    );

    // ————————————————————————————
    // 2) Gradient pre‑pass
    // ————————————————————————————
    text = text.replace(
        /<gradient:([^>]+)>([\s\S]*?)<\/gradient>/gi,
        (_, args, content) => {
            const colors = args
                .split(":")
                .map(c => c.trim())
                .map(c => (c.startsWith("#") ? c : `#${c}`));
            const gradientCss = `linear-gradient(90deg, ${colors.join(", ")})`;
            return `<span style="
        background: ${gradientCss};
        -webkit-background-clip: text;
        color: transparent;
      ">${content}</span>`;
        }
    );

    // ————————————————————————————
    // 3) Remaining MiniMessage → HTML tags
    // ————————————————————————————
    let out = "";
    const stack = [];
    const tagRe = /<(\/?)([A-Za-z0-9_#]+)(?::([^>]+))?>/g;
    let lastIndex = 0, m;

    while ((m = tagRe.exec(text)) !== null) {
        out += text.slice(lastIndex, m.index);
        lastIndex = tagRe.lastIndex;

        const [rawTag, slash, rawName, rawArg] = m;
        const name = rawName.toLowerCase();
        const arg  = rawArg?.trim() ?? "";

        if (slash) {
            // closing tag: unwind stack until matching opener
            for (let i = stack.length - 1; i >= 0; i--) {
                if (stack[i].name === name) {
                    while (stack.length > i) {
                        out += stack.pop().close;
                    }
                    break;
                }
            }
        } else {
            // opening tag
            if (name === "color" || name === "colour" || name === "c") {
                // verbose color
                let c = arg;
                if (namedColors[c.toLowerCase()]) c = namedColors[c.toLowerCase()];
                else if (!c.startsWith("#"))       c = `#${c}`;
                out += `<span style="color:${c};">`;
                stack.push({ name, close: "</span>" });

            } else if (namedColors[name]) {
                // simple named color
                out += `<span style="color:${namedColors[name]};">`;
                stack.push({ name, close: "</span>" });

            } else if (/^#[0-9A-Fa-f]{6}$/.test(name)) {
                // simple hex
                out += `<span style="color:${name};">`;
                stack.push({ name, close: "</span>" });

            } else if (name === "bold" || name === "b") {
                out += `<span class="font-bold">`;
                stack.push({ name, close: "</span>" });

            } else if (name === "italic" || name === "i" || name === "em") {
                out += `<span class="italic">`;
                stack.push({ name, close: "</span>" });

            } else if (name === "underline" || name === "u") {
                out += `<span class="underline">`;
                stack.push({ name, close: "</span>" });

            } else if (name === "strikethrough" || name === "st" || name === "m") {
                out += `<span class="line-through">`;
                stack.push({ name, close: "</span>" });

            } else if (name === "obfuscated" || name === "obf" || name === "k") {
                out += `<span class="obfuscated" data-obfuscated>`;
                stack.push({ name, close: "</span>" });

            } else {
                // unknown tag: drop it
            }
        }
    }

    // append remaining text & close any open tags
    out += text.slice(lastIndex);
    while (stack.length) {
        out += stack.pop().close;
    }

    return out;
}
