'use client';

import { useState, useEffect } from 'react';
import useMotd from '@/components/MotdHandlers';
import Obfuscator from '@/components/Obfuscator';

export default function MotdPage() {
  const {
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
    colorMap
  } = useMotd();

  const isMiniMessage = (text) => /<[^>]+>/.test(text);



  return (

      <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white py-12 px-4 md:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-md">MOTD Generator</h1>

          <section className="bg-zinc-800 rounded-2xl p-6 shadow-xl">
            <label htmlFor="motd-input" className="block font-semibold mb-2">Enter your MOTD</label>
            <textarea
                id="motd-input"
                value={motd}
                onChange={(e) => setMotd(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-3 text-white placeholder-zinc-400 focus:outline-none focus:ring focus:ring-green-500"
            />
            <label className="mt-3 flex items-center gap-2">
              <input type="checkbox" checked={centered} onChange={(e) => setCentered(e.target.checked)} />
              Center MOTD lines
            </label>
          </section>

          <section className="bg-zinc-800 rounded-2xl p-6 shadow-xl">
            <label className="block font-semibold mb-4">Formatting</label>
            <div className="space-y-4">

              {isMiniMessage(motd) ? (
                  <p className="text-yellow-300 italic">
                    MiniMessage mode enabled — legacy codes are disabled
                  </p>
              ) : (
                  <div className="space-y-4">
                    {/* Row 1: Colors */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: '0', name: 'Black', color: '#000000' },
                        { code: '1', name: 'Dark Blue', color: '#0000aa' },
                        { code: '2', name: 'Dark Green', color: '#00aa00' },
                        { code: '3', name: 'Dark Aqua', color: '#00aaaa' },
                        { code: '4', name: 'Dark Red', color: '#aa0000' },
                        { code: '5', name: 'Dark Purple', color: '#aa00aa' },
                        { code: '6', name: 'Gold', color: '#ffaa00' },
                        { code: '7', name: 'Gray', color: '#aaaaaa' },
                        { code: '8', name: 'Dark Gray', color: '#555555' },
                        { code: '9', name: 'Blue', color: '#5555ff' },
                        { code: 'a', name: 'Green', color: '#55ff55' },
                        { code: 'b', name: 'Aqua', color: '#55ffff' },
                        { code: 'c', name: 'Red', color: '#ff5555' },
                        { code: 'd', name: 'Light Purple', color: '#ff55ff' },
                        { code: 'e', name: 'Yellow', color: '#ffff55' },
                        { code: 'f', name: 'White', color: '#ffffff' },
                      ].map(({ code, name, color }) => (
                          <button
                              key={code}
                              title={`&${code} ${name}`}
                              onClick={() => insertCode(code)}
                              className="w-6 h-6 rounded-full ring-1 ring-white/10 hover:scale-110 transition"
                              style={{ backgroundColor: color }}
                          />
                      ))}
                    </div>
                    {/* Row 2: Formatting */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: 'l', label: 'Bold' },
                        { code: 'n', label: 'Underline' },
                        { code: 'o', label: 'Italic' },
                        { code: 'm', label: 'Strikethrough' },
                        { code: 'k', label: 'Obfuscated' },
                        { code: 'r', label: 'Reset' },
                      ].map(({ code, label }) => (
                          <button
                              key={code}
                              title={`&${code} ${label}`}
                              onClick={() => insertCode(code)}
                              className="px-3 py-1 text-xs font-semibold bg-zinc-700 rounded border border-zinc-600 hover:bg-zinc-600 transition"
                          >
                            {label}
                          </button>
                      ))}
                    </div>
                  </div>
              )}
            </div>

          </section>


          <section className="bg-black rounded-2xl p-6 font-mono shadow-xl">
            <Obfuscator
                html={preview}
                centered={centered}
                className="whitespace-pre-wrap font-mono text-sm"
            />

          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-zinc-800 p-4 rounded-xl shadow-lg">
              <label className="block font-semibold mb-1">Vanilla</label>
              <input
                  type="text"
                  value={vanilla}
                  readOnly
                  className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded"
              />
            </div>
            <div className="bg-zinc-800 p-4 rounded-xl shadow-lg">
              <label className="block font-semibold mb-1">Spigot</label>
              <input
                  type="text"
                  value={spigot}
                  readOnly
                  className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded"
              />
            </div>
            <div className="bg-zinc-800 p-4 rounded-xl shadow-lg">
              <label className="block font-semibold mb-1">BungeeCord</label>
              <input
                  type="text"
                  value={bungee}
                  readOnly
                  className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded"
              />
            </div>
            <div className="bg-zinc-800 p-4 rounded-xl shadow-lg">
              <label className="block font-semibold mb-1">ServerListPlus</label>
              <textarea
                  value={slp}
                  readOnly
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded"
              />
            </div>
          </section>
        </div>
      </main>
  );
}
