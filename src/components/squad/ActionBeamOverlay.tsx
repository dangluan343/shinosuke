"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { soundFx } from "@/lib/audio";

interface ActionBeamOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

export function ActionBeamOverlay({ isActive, onComplete }: ActionBeamOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Play synthesized Action Beam audio sequence
    soundFx.playActionBeam();

    // Prevent scrolling during cinematic sequence
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      document.body.style.overflow = originalOverflow;
      onComplete();
    }, 2400);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isActive, onComplete]);

  if (!mounted || !isActive) return null;

  const content = (
    <div
      id="action-beam-overlay"
      className="fixed inset-0 w-screen h-screen w-dvw h-dvh pointer-events-none overflow-hidden select-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 999999,
      }}
    >
      {/* 1. GPU-Friendly Manga Flash & Speedlines (No heavy blur or blend modes) */}
      <div
        id="beam-glory-flash"
        className="absolute inset-0 bg-gradient-to-r from-red-600/25 via-yellow-400/30 to-emerald-500/25 glory-flash-anim"
      />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.7) 0deg 6deg, transparent 6deg 14deg)",
        }}
      />

      {/* 2. Shockwave Rings (Fast GPU Borders) */}
      <div
        id="beam-shockwave"
        className="absolute top-[58%] left-1/4 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-80 md:h-80 rounded-full border-white shockwave-anim"
      />
      <div
        id="beam-shockwave-2"
        className="absolute top-[58%] left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[420px] md:h-[420px] rounded-full border-yellow-300 shockwave-anim"
        style={{ animationDelay: "0.2s" }}
      />

      {/* 3. Floating Manga Starbursts */}
      <div className="absolute inset-0 pointer-events-none" id="beam-sparkles-container">
        <div className="sparkle-item absolute top-[16vh] left-[12vw] text-3xl text-yellow-300">
          ✨
        </div>
        <div
          className="sparkle-item absolute top-[78vh] left-[20vw] text-4xl text-white"
          style={{ animationDelay: "0.15s" }}
        >
          💥
        </div>
        <div
          className="sparkle-item absolute top-[18vh] left-[82vw] text-4xl text-yellow-400"
          style={{ animationDelay: "0.3s" }}
        >
          ⚡
        </div>
        <div
          className="sparkle-item absolute top-[75vh] left-[72vw] text-3xl text-emerald-400"
          style={{ animationDelay: "0.2s" }}
        >
          ✨
        </div>
      </div>

      {/* 4. Comic Burst Dialogue Banner - Compact & Placed High to NEVER Obscure Hero's Head */}
      <div className="absolute top-2 sm:top-4 md:top-6 inset-x-0 flex justify-center items-center pointer-events-none z-20 px-3">
        <div className="comic-banner-pop max-w-[92vw] sm:max-w-lg md:max-w-xl w-full bg-[#ffd200] border-[3px] md:border-[4px] border-black p-2.5 sm:p-3 md:p-4 rounded-xl md:rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="inline-block bg-primary text-white text-[10px] sm:text-xs font-label-bold uppercase px-2.5 py-0.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] mb-1">
            ⚡ SIÊU NHÂN HÀNH ĐỘNG ACTION KAMEN ⚡
          </div>
          <h2 className="font-display-lg text-xl sm:text-2xl md:text-4xl uppercase italic text-red-600 font-black tracking-tight drop-shadow-[2px_2px_0px_#1e1b18] leading-tight">
            WA-HA-HA-HA! ACTION BEAM! ⚡💥
          </h2>
          <p className="font-mono text-[10px] sm:text-xs md:text-xs font-black text-black tracking-wider mt-0.5">
            アクションビーム！正義は必ず勝つ！ (CÔNG LÝ BẤT DIỆT!)
          </p>
        </div>
      </div>

      {/* 5. Hero & Laser System - Placed at Top 58% with Generous Clearance from Banner */}
      <div className="absolute top-[58%] -translate-y-1/2 left-0 right-0 w-full flex items-center pointer-events-none z-30 pl-2 sm:pl-6 md:pl-10 lg:pl-14">
        {/* Action Kamen Hero Figure (Unobstructed Head & Firing Stance) */}
        <div
          id="action-kamen-hero"
          className="relative flex-shrink-0 w-64 sm:w-76 md:w-88 lg:w-[380px] hero-action-enter"
          style={{ filter: "drop-shadow(6px 6px 0px rgba(0,0,0,0.9))" }}
        >
          <svg
            className="w-full h-auto overflow-visible"
            viewBox="0 -25 380 285"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Billowing Heroic Cape */}
            <g className="cape-anim">
              <path
                d="M110 95 C45 80 10 115 5 190 C40 160 80 170 115 140 Z"
                fill="#e60012"
                stroke="#1e1b18"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M95 105 C40 100 20 145 10 215 C45 180 85 185 110 155 Z"
                fill="#9e000c"
                stroke="#1e1b18"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </g>

            {/* Flying Streamlined Legs */}
            <g>
              <path
                d="M125 150 L65 200 L50 188 L105 140 Z"
                fill="#0b3c6d"
                stroke="#1e1b18"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M65 200 L35 215 L25 200 L50 188 Z"
                fill="#e60012"
                stroke="#1e1b18"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M150 155 L85 220 L70 205 L130 142 Z"
                fill="#0f4c8a"
                stroke="#1e1b18"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M85 220 L55 240 L45 225 L70 205 Z"
                fill="#ffd700"
                stroke="#1e1b18"
                strokeWidth="6"
                strokeLinejoin="round"
              />
            </g>

            {/* Muscular Tokusatsu Torso */}
            <path
              d="M135 90 L230 75 L245 150 L140 158 Z"
              fill="#00a86b"
              stroke="#1e1b18"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            {/* White & Gold Chest Armor Plate */}
            <polygon
              points="160,85 225,78 200,145 155,145"
              fill="#ffffff"
              stroke="#1e1b18"
              strokeWidth="5"
            />
            <polygon
              points="170,85 215,80 195,130"
              fill="#ffd700"
              stroke="#1e1b18"
              strokeWidth="3.5"
            />
            {/* Bold Red 'A' Emblem */}
            <text
              x="185"
              y="118"
              fill="#e60012"
              stroke="#1e1b18"
              strokeWidth="1.5"
              fontFamily="'Space Grotesk', 'Impact', sans-serif"
              fontSize="30"
              fontWeight="900"
            >
              A
            </text>

            {/* Action Champion Belt */}
            <path
              d="M135 150 L242 142 L240 165 L138 168 Z"
              fill="#ffffff"
              stroke="#1e1b18"
              strokeWidth="5"
            />
            <circle cx="188" cy="154" r="13" fill="#ffd700" stroke="#1e1b18" strokeWidth="4" />
            <circle cx="188" cy="154" r="5" fill="#e60012" />

            {/* Action Mask Helmet & Hero Face (Unclipped with full clearance) */}
            <ellipse
              cx="235"
              cy="52"
              rx="36"
              ry="34"
              fill="#0f2b48"
              stroke="#1e1b18"
              strokeWidth="7"
            />
            <path
              d="M205 50 C210 26 260 26 265 50 Z"
              fill="#00a86b"
              stroke="#1e1b18"
              strokeWidth="5"
            />
            {/* Golden Ear Wing Fins */}
            <path
              d="M205 35 L175 15 L202 50 Z"
              fill="#ffd700"
              stroke="#1e1b18"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M265 35 L295 15 L268 50 Z"
              fill="#ffd700"
              stroke="#1e1b18"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Forehead Crest & Ruby Gem (Fully within viewBox) */}
            <path d="M224 24 L235 6 L246 24 Z" fill="#ffd700" stroke="#1e1b18" strokeWidth="4" />
            <line x1="235" y1="6" x2="235" y2="-10" stroke="#1e1b18" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="235" cy="-12" r="7" fill="#e60012" stroke="#1e1b18" strokeWidth="3" />

            {/* Sharp Piercing Golden Visor Eyes */}
            <polygon
              points="216,42 232,48 220,58"
              fill="#ffea00"
              stroke="#1e1b18"
              strokeWidth="3.5"
            />
            <polygon
              points="254,42 238,48 250,58"
              fill="#ffea00"
              stroke="#1e1b18"
              strokeWidth="3.5"
            />

            {/* Heroic Smile / Jawline */}
            <path
              d="M222 66 Q235 84 250 66 Z"
              fill="#ffffff"
              stroke="#1e1b18"
              strokeWidth="4.5"
            />
            <path
              d="M226 70 Q235 78 246 70"
              stroke="#1e1b18"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Left Arm Thrust Forward */}
            <path
              d="M170 85 L260 95 L270 120 L180 115 Z"
              fill="#00a86b"
              stroke="#1e1b18"
              strokeWidth="6"
              strokeLinejoin="round"
            />

            {/* Right Arm Extended & Firing Gauntlet */}
            <path
              d="M225 80 L320 85 L325 118 L230 115 Z"
              fill="#00a86b"
              stroke="#1e1b18"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <path
              d="M305 85 L350 88 L350 122 L305 118 Z"
              fill="#e60012"
              stroke="#1e1b18"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <rect x="312" y="84" width="10" height="36" fill="#ffd700" stroke="#1e1b18" strokeWidth="3" />

            {/* Firing Hands at (352, 104) */}
            <circle cx="352" cy="104" r="16" fill="#ffd700" stroke="#1e1b18" strokeWidth="5" />
            <circle cx="352" cy="104" r="8" fill="#ffffff" />
          </svg>

          {/* Golden Energy Plasma Orb Charging at Hands (Zero blur lag) */}
          <div className="absolute top-[38%] right-[-10px] -translate-y-1/2 w-14 h-14 md:w-20 md:h-20 pointer-events-none z-20">
            <div className="w-full h-full rounded-full bg-yellow-300 opacity-80 orb-pulse-anim" />
            <div className="absolute inset-2 rounded-full bg-white opacity-90 animate-ping" />
            <div className="absolute inset-3 rounded-full bg-yellow-200 border-2 border-white shadow-[0_0_15px_#ffff00]" />
          </div>
        </div>

        {/* Action Beam Laser Blast Track (Zero blur lag, hardware-accelerated gradients) */}
        <div className="relative flex-grow h-32 md:h-44 flex items-center pointer-events-none -ml-4 md:-ml-6 z-10 overflow-visible">
          <div className="action-beam-blast relative h-full flex items-center w-full">
            {/* Outer Energy Glow Aura (CSS Gradient, No Blur) */}
            <div className="absolute inset-x-0 h-28 md:h-40 bg-gradient-to-r from-yellow-300/80 via-lime-400/80 to-cyan-300/80 rounded-r-3xl opacity-75" />

            {/* Mid Energy Plasma Beam with Neo-Brutalist Border */}
            <div className="absolute inset-x-0 h-18 md:h-26 bg-gradient-to-r from-red-600 via-yellow-300 to-cyan-300 rounded-r-2xl border-y-[3px] md:border-y-[4px] border-r-[4px] border-black shadow-[0_0_30px_#ffff00]" />

            {/* Blinding White Hot Core */}
            <div className="absolute inset-x-0 h-6 md:h-9 bg-white rounded-r-xl border-y-2 border-black shadow-[0_0_20px_#ffffff]" />

            {/* Blast Wave Tip (Leading Edge of Beam) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-24 h-24 md:w-32 md:h-32 bg-yellow-300 rounded-full opacity-85 animate-pulse" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-14 h-14 md:w-20 md:h-20 bg-white rounded-full border-3 md:border-4 border-black shadow-[0_0_20px_#ffffff]" />

            {/* Comic Sound Effect Chips Floating on Beam (Well away from hero's head) */}
            <div className="absolute top-[-24px] left-[32%] bg-white text-black font-black text-xs md:text-sm px-2.5 py-0.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] rotate-[-5deg]">
              💥 BZZZZZT!
            </div>
            <div className="absolute bottom-[-24px] left-[58%] bg-yellow-300 text-red-600 font-black text-xs md:text-sm px-2.5 py-0.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] rotate-[4deg]">
              ⚡ PEWWWW!
            </div>
            <div className="absolute top-[-22px] left-[82%] bg-primary text-white font-black text-xs md:text-sm px-2.5 py-0.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] rotate-[-3deg]">
              💥 ZUDOOON!
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
