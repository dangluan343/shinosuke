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
      {/* 1. Dramatic Manga Atmosphere & Speedlines */}
      <div
        id="beam-glory-flash"
        className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-yellow-400/35 to-emerald-500/30 glory-flash-anim"
      />
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.6) 0deg 6deg, transparent 6deg 14deg)",
        }}
      />

      {/* 2. Shockwave Rings Centered in Viewport */}
      <div
        id="beam-shockwave"
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border-white shockwave-anim"
      />
      <div
        id="beam-shockwave-2"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[480px] md:h-[480px] rounded-full border-yellow-300 shockwave-anim"
        style={{ animationDelay: "0.2s" }}
      />

      {/* 3. Floating Manga Starbursts */}
      <div className="absolute inset-0 pointer-events-none" id="beam-sparkles-container">
        <div className="sparkle-item absolute top-[20vh] left-[15vw] text-4xl text-yellow-300 drop-shadow-[2px_2px_0px_#000]">
          ✨
        </div>
        <div
          className="sparkle-item absolute top-[75vh] left-[25vw] text-5xl text-white drop-shadow-[2px_2px_0px_#000]"
          style={{ animationDelay: "0.15s" }}
        >
          💥
        </div>
        <div
          className="sparkle-item absolute top-[22vh] left-[78vw] text-5xl text-yellow-400 drop-shadow-[3px_3px_0px_#000]"
          style={{ animationDelay: "0.3s" }}
        >
          ⚡
        </div>
        <div
          className="sparkle-item absolute top-[72vh] left-[70vw] text-4xl text-emerald-400 drop-shadow-[2px_2px_0px_#000]"
          style={{ animationDelay: "0.2s" }}
        >
          ✨
        </div>
        <div
          className="sparkle-item absolute top-[15vh] left-[45vw] text-4xl text-red-500 drop-shadow-[3px_3px_0px_#000]"
          style={{ animationDelay: "0.35s" }}
        >
          ⚡
        </div>
      </div>

      {/* 4. Comic Burst Dialogue Banner - Perfectly Centered at Top of Viewport */}
      <div className="absolute top-4 sm:top-6 md:top-10 inset-x-0 flex justify-center items-center pointer-events-none z-50 px-4">
        <div className="comic-banner-pop max-w-[94vw] sm:max-w-xl md:max-w-2xl w-full bg-[#ffd200] border-[4px] md:border-[5px] border-black p-3.5 sm:p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="inline-block bg-primary text-white text-[11px] sm:text-xs md:text-sm font-label-bold uppercase px-3 py-1 border-2 border-black rounded-md shadow-[2px_2px_0px_#000] mb-1.5 sm:mb-2">
            ⚡ SIÊU NHÂN HÀNH ĐỘNG ACTION KAMEN ⚡
          </div>
          <h2 className="font-display-lg text-2xl sm:text-3xl md:text-5xl uppercase italic text-red-600 font-black tracking-tight drop-shadow-[3px_3px_0px_#1e1b18] leading-tight">
            WA-HA-HA-HA! ACTION BEAM! ⚡💥
          </h2>
          <p className="font-mono text-[11px] sm:text-xs md:text-sm font-black text-black tracking-wider mt-1">
            アクションビーム！正義は必ず勝つ！ (CÔNG LÝ BẤT DIỆT!)
          </p>
        </div>
      </div>

      {/* 5. Hero & Action Beam System (Vertically Centered in Screen Viewport) */}
      <div className="absolute top-[52%] -translate-y-1/2 left-0 right-0 w-full flex items-center pointer-events-none z-40 pl-2 sm:pl-6 md:pl-12 lg:pl-16">
        {/* Action Kamen Hero Figure (Heroic Stance & Firing Pose) */}
        <div
          id="action-kamen-hero"
          className="relative flex-shrink-0 w-72 sm:w-84 md:w-96 lg:w-[420px] drop-shadow-[10px_10px_0px_rgba(0,0,0,1)] hero-action-enter"
        >
          <svg
            className="w-full h-auto overflow-visible"
            viewBox="0 0 380 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Billowing Heroic Cape */}
            <g className="cape-anim">
              <path
                d="M110 95 C45 80 10 115 5 190 C40 160 80 170 115 140 Z"
                fill="#e60012"
                stroke="#1e1b18"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M95 105 C40 100 20 145 10 215 C45 180 85 185 110 155 Z"
                fill="#9e000c"
                stroke="#1e1b18"
                strokeWidth="5"
                strokeLinejoin="round"
              />
            </g>

            {/* Flying Legs Streamlined */}
            <g>
              {/* Back Leg */}
              <path
                d="M125 150 L65 200 L50 188 L105 140 Z"
                fill="#0b3c6d"
                stroke="#1e1b18"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M65 200 L35 215 L25 200 L50 188 Z"
                fill="#e60012"
                stroke="#1e1b18"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              {/* Front Leg */}
              <path
                d="M150 155 L85 220 L70 205 L130 142 Z"
                fill="#0f4c8a"
                stroke="#1e1b18"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M85 220 L55 240 L45 225 L70 205 Z"
                fill="#ffd700"
                stroke="#1e1b18"
                strokeWidth="7"
                strokeLinejoin="round"
              />
            </g>

            {/* Muscular Tokusatsu Torso */}
            <path
              d="M135 90 L230 75 L245 150 L140 158 Z"
              fill="#00a86b"
              stroke="#1e1b18"
              strokeWidth="8"
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
              strokeWidth="4"
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
              strokeWidth="6"
            />
            <circle cx="188" cy="154" r="14" fill="#ffd700" stroke="#1e1b18" strokeWidth="5" />
            <circle cx="188" cy="154" r="6" fill="#e60012" />

            {/* Action Mask Helmet & Hero Face */}
            {/* Dark Blue Cowl Base */}
            <ellipse
              cx="235"
              cy="52"
              rx="36"
              ry="34"
              fill="#0f2b48"
              stroke="#1e1b18"
              strokeWidth="8"
            />
            <path
              d="M205 50 C210 26 260 26 265 50 Z"
              fill="#00a86b"
              stroke="#1e1b18"
              strokeWidth="6"
            />
            {/* Golden Ear Wing Fins */}
            <path
              d="M205 35 L175 15 L202 50 Z"
              fill="#ffd700"
              stroke="#1e1b18"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M265 35 L295 15 L268 50 Z"
              fill="#ffd700"
              stroke="#1e1b18"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Forehead Crest & Ruby Gem */}
            <path d="M224 24 L235 6 L246 24 Z" fill="#ffd700" stroke="#1e1b18" strokeWidth="5" />
            <line x1="235" y1="6" x2="235" y2="-10" stroke="#1e1b18" strokeWidth="5" strokeLinecap="round" />
            <circle cx="235" cy="-12" r="7" fill="#e60012" stroke="#1e1b18" strokeWidth="3" />

            {/* Sharp Piercing Golden Visor Eyes */}
            <polygon
              points="216,42 232,48 220,58"
              fill="#ffea00"
              stroke="#1e1b18"
              strokeWidth="4"
            />
            <polygon
              points="254,42 238,48 250,58"
              fill="#ffea00"
              stroke="#1e1b18"
              strokeWidth="4"
            />

            {/* Heroic Smile / Jawline */}
            <path
              d="M222 66 Q235 84 250 66 Z"
              fill="#ffffff"
              stroke="#1e1b18"
              strokeWidth="5"
            />
            <path
              d="M226 70 Q235 78 246 70"
              stroke="#1e1b18"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Left Arm Thrust Forward */}
            <path
              d="M170 85 L260 95 L270 120 L180 115 Z"
              fill="#00a86b"
              stroke="#1e1b18"
              strokeWidth="7"
              strokeLinejoin="round"
            />

            {/* Right Arm Extended & Firing Gauntlet */}
            <path
              d="M225 80 L320 85 L325 118 L230 115 Z"
              fill="#00a86b"
              stroke="#1e1b18"
              strokeWidth="8"
              strokeLinejoin="round"
            />
            {/* Red & Gold Action Gauntlet */}
            <path
              d="M305 85 L350 88 L350 122 L305 118 Z"
              fill="#e60012"
              stroke="#1e1b18"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <rect x="312" y="84" width="10" height="36" fill="#ffd700" stroke="#1e1b18" strokeWidth="3" />

            {/* Firing Hands at (350, 105) */}
            <circle cx="352" cy="104" r="16" fill="#ffd700" stroke="#1e1b18" strokeWidth="6" />
            <circle cx="352" cy="104" r="8" fill="#ffffff" />
          </svg>

          {/* Golden Energy Plasma Orb Charging at Hands */}
          <div className="absolute top-[38%] right-[-10px] -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 pointer-events-none z-20">
            <div className="w-full h-full rounded-full bg-yellow-300 opacity-90 orb-pulse-anim blur-sm" />
            <div className="absolute inset-2 rounded-full bg-white opacity-95 animate-ping" />
            <div className="absolute inset-3 rounded-full bg-yellow-200 border-2 border-white shadow-[0_0_20px_#ffff00]" />
          </div>
        </div>

        {/* Action Beam Laser Blast Track (Shooting Forward from Hands across Screen) */}
        <div className="relative flex-grow h-36 md:h-48 flex items-center pointer-events-none -ml-4 md:-ml-6 z-10 overflow-visible">
          <div className="action-beam-blast relative h-full flex items-center w-full">
            {/* Outer Giant Glowing Neon Aura */}
            <div className="absolute inset-x-0 h-36 md:h-48 bg-gradient-to-r from-yellow-300 via-lime-400 to-cyan-400 opacity-80 blur-2xl" />

            {/* Mid Energy Plasma Beam with Neo-Brutalist Border */}
            <div className="absolute inset-x-0 h-20 md:h-28 bg-gradient-to-r from-red-600 via-yellow-300 to-cyan-300 rounded-r-3xl border-y-[4px] md:border-y-[5px] border-r-[4px] border-black shadow-[0_0_40px_#ffff00]" />

            {/* Blinding White Hot Core */}
            <div className="absolute inset-x-0 h-7 md:h-10 bg-white rounded-r-2xl border-y-2 border-black shadow-[0_0_25px_#ffffff]" />

            {/* Blast Wave Tip (Leading Edge of Beam) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-28 h-28 md:w-40 md:h-40 bg-yellow-300 rounded-full blur-md opacity-85 animate-pulse" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full border-4 border-black shadow-[0_0_30px_#ffffff]" />

            {/* Comic Sound Effect Chips Floating on Beam */}
            <div className="absolute top-[-28px] left-[15%] bg-white text-black font-black text-xs md:text-sm px-2.5 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000] rotate-[-6deg]">
              💥 BZZZZZT!
            </div>
            <div className="absolute bottom-[-28px] left-[45%] bg-yellow-300 text-red-600 font-black text-xs md:text-sm px-2.5 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000] rotate-[5deg]">
              ⚡ PEWWWW!
            </div>
            <div className="absolute top-[-26px] left-[70%] bg-primary text-white font-black text-xs md:text-sm px-2.5 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000] rotate-[-4deg]">
              💥 ZUDOOON!
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
