'use client';
import { useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const INTERVAL = 75; // ms

export default function Obfuscator({ html, centered = false }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        const els = ref.current.querySelectorAll('[data-obfuscated]');
        const trackers = [];

        els.forEach(el => {
            const original = el.textContent;
            const id = setInterval(() => {
                el.textContent = Array.from({ length: original.length })
                    .map(() => CHARS.charAt(Math.floor(Math.random() * CHARS.length)))
                    .join('');
            }, INTERVAL);
            trackers.push({ el, original, id });
        });

        return () => {
            trackers.forEach(({ el, original, id }) => {
                clearInterval(id);
                el.textContent = original;
            });
        };
    }, [html]);

    const lines = html.split('<br>').map((line, i) => (
        <div
            key={i}
            className={centered ? 'w-full text-center' : ''}
            dangerouslySetInnerHTML={{ __html: line }}
        />
    ));

    return <div ref={ref}>{lines}</div>;
}
