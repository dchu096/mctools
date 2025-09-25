'use client';
import React, { useEffect } from 'react';
import renderMiniMessageToHtml from '@/utils/renderMiniMessageToHtml';

export default function MiniMessageRenderer({ text }) {
    useEffect(() => {
        // Animate all obfuscated spans infinitely
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}[]<>?/\\|~';

        document.querySelectorAll('[data-obfuscated]').forEach((el) => {
            if (el._obfInterval) clearInterval(el._obfInterval);
            const originalLength = el.textContent.length || 6;

            el._obfInterval = setInterval(() => {
                el.textContent = Array.from({ length: originalLength }, () =>
                    chars[Math.floor(Math.random() * chars.length)]
                ).join('');
            }, 75);
        });
    }, [text]);

    return (
        <div
            className="whitespace-pre-wrap text-sm"
            dangerouslySetInnerHTML={{ __html: renderMiniMessageToHtml(text) }}
        />
    );
}
