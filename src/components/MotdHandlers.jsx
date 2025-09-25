'use client';
import { useState, useEffect } from 'react';
import hybridParseToHTML       from '@/utils/hybridParseToHTML';       // your legacy &‑code → HTML
import renderMiniMessageToHtml from '@/utils/renderMiniMessageToHtml'; // full MiniMessage → HTML


export default function MotdHandlers() {
    const [motd, setMotd] = useState("A Minecraft Server\n&4Here is another line");
    const [centered, setCentered] = useState(false);
    const [preview, setPreview] = useState('');
    const [vanilla, setVanilla] = useState('');
    const [spigot, setSpigot] = useState('');
    const [bungee, setBungee] = useState('');
    const [slp, setSlp] = useState('');

    const colorMap = {
        "0": "#000000", "1": "#0000AA", "2": "#00AA00", "3": "#00AAAA",
        "4": "#AA0000", "5": "#AA00AA", "6": "#FFAA00", "7": "#AAAAAA",
        "8": "#555555", "9": "#5555FF", "a": "#55FF55", "b": "#55FFFF",
        "c": "#FF5555", "d": "#FF55FF", "e": "#FFFF55", "f": "#FFFFFF"
    };

    const formattingMap = {
        l: 'font-bold',
        n: 'underline',
        o: 'italic',
        m: 'line-through',
        k: 'obfuscated', // or your animated class
    };

    const centerLine = (line) => {
        const total = 80;
        const pad = Math.floor((total - line.trim().length) / 2);
        return ' '.repeat(Math.max(pad, 0)) + line.trim();
    };

    const isMiniMessage = (text) => /<[^>]+>/.test(text);

    useEffect(() => {
        const lines = motd.split("\n");
        const centeredLines = centered ? lines.map(centerLine) : lines;
        const raw = centeredLines.join("\n");

        // Unified hybrid parser
        const parsedHTML = hybridParseToHTML(raw);
        setPreview(parsedHTML);

        // Other format exports
        setVanilla(raw.replace(/&/g, '\\u00A7').replace(/\n/g, '\\n'));
        setSpigot(raw.replace(/&/g, '\\u00A7').replace(/\n/g, '\\n'));
        setBungee(`"${raw.replace(/&/g, '&').replace(/\n/g, '\\n')}"`);
        setSlp(`- |-\n  ${centeredLines.join("\n  ")}`);
    }, [motd, centered]);

    const insertCode = (code) => {
        const textarea = document.getElementById("motd-input");
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const updated = motd.substring(0, start) + `&${code}` + motd.substring(end);
        setMotd(updated);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
    };

    return {
        motd,
        setMotd,
        centered,
        setCentered,
        preview,
        vanilla,
        spigot,
        bungee,
        slp,
        insertCode,
        colorMap,
    };
}
