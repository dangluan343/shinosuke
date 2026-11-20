"use client";

import React, { useEffect } from "react";
import { soundFx } from "@/lib/audio";

interface ActionBeamOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

export function ActionBeamOverlay({ isActive, onComplete }: ActionBeamOverlayProps) {
  useEffect(() => {
    if (!isActive) return;

    // Play synthesized Action Beam audio sequence
    soundFx.playActionBeam();

    const timer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div
      id="action-beam-overlay"
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
    >
      {/* Energy Flash Background */}
      <div
        id="beam-glory-flash"
        className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-yellow-400/35 to-emerald-500/30 glory-flash-anim"
      />

      {/* Radial Speedlines */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.5) 0deg 6deg, transparent 6deg 14deg)",
        }}
      />

      {/* Shockwave Rings */}
      <div
        id="beam-shockwave"
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-white shockwave-anim"
      />
      <div
        id="beam-shockwave-2"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-yellow-300 shockwave-anim"
        style={{ animationDelay: "0.2s" }}
      />

      {/* Action Beam Laser Track across screen */}
      <div
        id="beam-laser-track"
        className="absolute top-[48%] left-0 w-0 h-28 -translate-y-1/2 flex flex-col justify-center pointer-events-none laser-sweep-anim"
      >
        <div className="relative w-full h-full flex items-center">
          <div className="absolute inset-x-0 h-32 bg-gradient-to-r from-lime-400 via-emerald-400 to-yellow-300 opacity-70 blur-xl" />
          <div className="absolute inset-x-0 h-16 bg-gradient-to-r from-red-600 via-yellow-400 to-cyan-300 border-y-4 border-black shadow-[0_0_35px_#ffff00]" />
          <div className="absolute inset-x-0 h-6 bg-white border-y-2 border-black shadow-[0_0_20px_#ffffff]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-24 h-24 bg-yellow-300 rounded-full blur-md opacity-80 animate-ping" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-16 h-16 bg-white rounded-full border-4 border-black" />
        </div>
      </div>

      {/* Floating Starbursts */}
      <div className="absolute inset-0 pointer-events-none" id="beam-sparkles-container">
        <div className="sparkle-item absolute top-[28%] left-[25%] text-4xl text-yellow-300 drop-shadow-[2px_2px_0px_#000]">
          ✨
        </div>
        <div
          className="sparkle-item absolute top-[62%] left-[45%] text-5xl text-white drop-shadow-[2px_2px_0px_#000]"
          style={{ animationDelay: "0.15s" }}
        >
          💥
        </div>
        <div
          className="sparkle-item absolute top-[35%] left-[70%] text-6xl text-yellow-400 drop-shadow-[3px_3px_0px_#000]"
          style={{ animationDelay: "0.3s" }}
        >
          ⚡
        </div>
        <div
          className="sparkle-item absolute top-[55%] left-[82%] text-4xl text-emerald-400 drop-shadow-[2px_2px_0px_#000]"
          style={{ animationDelay: "0.2s" }}
        >
          ✨
        </div>
        <div
          className="sparkle-item absolute top-[20%] left-[55%] text-5xl text-red-500 drop-shadow-[3px_3px_0px_#000]"
          style={{ animationDelay: "0.35s" }}
        >
          ⚡
        </div>
      </div>

      {/* Action Kamen Hero Flying Figure SVG */}
      <div
        id="action-kamen-hero"
        className="absolute top-[32%] -left-36 w-80 md:w-96 pointer-events-none drop-shadow-[12px_12px_0px_rgba(0,0,0,1)] kamen-flying"
      >
        <svg
          className="w-full h-auto overflow-visible"
          fill="none"
          viewBox="0 0 360 260"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cape */}
          <path
            className="cape-anim"
            d="M125 105 C70 90 20 120 5 185 C45 160 80 170 120 145 Z"
            fill="#e60012"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="7"
          />
          <path
            className="cape-anim"
            d="M110 115 C60 110 30 150 15 210 C50 180 85 185 115 160 Z"
            fill="#b7000c"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="5"
          />
          {/* Legs */}
          <path
            d="M135 155 L75 205 L60 195 L115 145 Z"
            fill="#003b74"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="7"
          />
          <path
            d="M75 205 L45 220 L35 205 L60 195 Z"
            fill="#e60012"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="7"
          />
          <path
            d="M160 160 L95 230 L80 215 L140 148 Z"
            fill="#0b5eaf"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="7"
          />
          <path
            d="M95 230 L60 250 L50 235 L80 215 Z"
            fill="#ffd700"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="7"
          />
          {/* Torso */}
          <path
            d="M150 95 L225 80 L235 150 L145 155 Z"
            fill="#00a86b"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="8"
          />
          <polygon
            fill="#ffd700"
            points="175,90 220,85 195,140"
            stroke="#1e1b18"
            strokeWidth="5"
          />
          <text
            fill="#e60012"
            fontFamily="'Space Grotesk', sans-serif"
            fontSize="28"
            fontWeight="900"
            stroke="#1e1b18"
            strokeWidth="1.5"
            x="187"
            y="125"
          >
            A
          </text>
          <path
            d="M140 150 L235 145 L232 165 L143 168 Z"
            fill="#ffffff"
            stroke="#1e1b18"
            strokeWidth="6"
          />
          <circle
            cx="188"
            cy="157"
            fill="#ffd700"
            r="14"
            stroke="#1e1b18"
            strokeWidth="5"
          />
          <circle cx="188" cy="157" fill="#e60012" r="6" />
          {/* Left Arm */}
          <path
            d="M150 95 L125 55 L145 45 L175 85 Z"
            fill="#003b74"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="7"
          />
          <path
            d="M125 55 L115 35 L135 25 L145 45 Z"
            fill="#ffd700"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="6"
          />
          {/* Helmet / Face */}
          <ellipse
            cx="235"
            cy="55"
            fill="#00a86b"
            rx="34"
            ry="32"
            stroke="#1e1b18"
            strokeWidth="8"
          />
          <path
            d="M220 28 L235 8 L250 28 Z"
            fill="#ffd700"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="6"
          />
          <line
            stroke="#1e1b18"
            strokeLinecap="round"
            strokeWidth="6"
            x1="235"
            x2="235"
            y1="8"
            y2="-12"
          />
          <circle cx="235" cy="-14" fill="#e60012" r="7" stroke="#1e1b18" strokeWidth="4" />
          <ellipse
            cx="225"
            cy="48"
            fill="#ffd700"
            rx="10"
            ry="14"
            stroke="#1e1b18"
            strokeWidth="5"
            transform="rotate(-15 225 48)"
          />
          <ellipse
            cx="250"
            cy="46"
            fill="#ffd700"
            rx="11"
            ry="14"
            stroke="#1e1b18"
            strokeWidth="5"
            transform="rotate(10 250 46)"
          />
          <path
            d="M225 65 Q238 82 255 65 Z"
            fill="#ffffff"
            stroke="#1e1b18"
            strokeWidth="5"
          />
          <path
            d="M230 68 Q240 76 250 68"
            stroke="#1e1b18"
            strokeLinecap="round"
            strokeWidth="4"
          />
          {/* Right Arm Extended Firing Beam */}
          <path
            d="M220 90 L290 82 L300 110 L230 118 Z"
            fill="#00a86b"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="8"
          />
          <path
            d="M285 82 L340 78 L345 115 L295 112 Z"
            fill="#ffffff"
            stroke="#1e1b18"
            strokeLinejoin="round"
            strokeWidth="7"
          />
          <rect
            fill="#e60012"
            height="34"
            stroke="#1e1b18"
            strokeWidth="4"
            width="12"
            x="298"
            y="78"
          />
          <ellipse
            cx="348"
            cy="96"
            fill="#ffd700"
            rx="16"
            ry="18"
            stroke="#1e1b18"
            strokeWidth="7"
          />
          <polygon
            fill="#ffffff"
            points="350,96 385,88 360,96 395,96 360,102 385,110 350,100 340,118 344,98 330,95 344,92 340,75"
            stroke="#e60012"
            strokeWidth="4"
          />
          <circle cx="355" cy="96" fill="#ffff00" r="10" />
        </svg>
      </div>

      {/* Comic Burst Dialogue Banner */}
      <div
        id="beam-comic-burst"
        className="absolute top-[18%] left-1/2 -translate-x-1/2 z-50 pointer-events-none comic-banner-pop"
      >
        <div className="relative bg-tertiary-fixed border-[5px] border-black p-4 md:p-6 rounded-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center transform rotate-[-3deg]">
          <div className="inline-block bg-primary text-white text-xs md:text-sm font-label-bold uppercase px-3 py-1 border-2 border-black rounded mb-2 shadow-[2px_2px_0px_#000]">
            ⚡ SIÊU NHÂN HÀNH ĐỘNG XUẤT HIỆN! ⚡
          </div>
          <h2 className="font-display-lg text-2xl md:text-5xl uppercase italic text-error tracking-tight drop-shadow-[4px_4px_0px_#1e1b18] whitespace-nowrap">
            WA-HA-HA-HA! ACTION BEAMMMMM! ⚡💥
          </h2>
          <p className="font-mono text-xs md:text-base font-black text-black tracking-widest mt-1">
            アクションビーム！正義は必ず勝つ！ (CÔNG LÝ BẤT DIỆT!)
          </p>
        </div>
      </div>
    </div>
  );
}

