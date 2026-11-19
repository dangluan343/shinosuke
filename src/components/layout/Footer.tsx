"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full px-4 sm:px-6 md:px-16 py-12 flex flex-col items-center text-center bg-tertiary-fixed border-t-[3px] border-on-background select-none">
      {/* Brand */}
      <span className="font-headline-sm text-2xl md:text-3xl text-on-tertiary-fixed uppercase italic tracking-tighter">
        SHIN-CHAN!
      </span>

      {/* Quick Links */}
      <div className="flex flex-wrap justify-center gap-6 my-6">
        <Link
          href="#"
          className="text-on-tertiary-fixed-variant font-label-bold text-sm hover:text-primary transition-colors hover:scale-105"
        >
          Privacy Policy
        </Link>
        <Link
          href="#"
          className="text-on-tertiary-fixed-variant font-label-bold text-sm hover:text-primary transition-colors hover:scale-105"
        >
          Help Misae
        </Link>
        <Link
          href="#"
          className="text-on-tertiary-fixed-variant font-label-bold text-sm hover:text-primary transition-colors hover:scale-105"
        >
          Action Mask Fan Club
        </Link>
      </div>

      {/* Reaction Icons */}
      <div className="flex gap-4 mb-6">
        <button
          className="w-12 h-12 bg-white neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active flex items-center justify-center cursor-pointer"
          aria-label="Thumbs up"
          onClick={() => alert("Shin-chan thanks you with a butt dance! 🍑")}
        >
          <span className="material-symbols-outlined text-primary text-2xl">thumb_up</span>
        </button>
        <button
          className="w-12 h-12 bg-white neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active flex items-center justify-center cursor-pointer"
          aria-label="Play video"
          onClick={() => alert("Playing Action Mask Special Episode! 📺")}
        >
          <span className="material-symbols-outlined text-primary text-2xl">play_circle</span>
        </button>
        <button
          className="w-12 h-12 bg-white neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active flex items-center justify-center cursor-pointer"
          aria-label="Share"
          onClick={() => alert("Shared to Kasukabe Neighborhood Chat! 💬")}
        >
          <span className="material-symbols-outlined text-primary text-2xl">share</span>
        </button>
      </div>

      {/* Copyright Notice */}
      <p className="font-body-md text-xs sm:text-sm text-on-tertiary-fixed max-w-md uppercase tracking-wider">
        © USUI YOSHITO / SHIN-EI ANIMATION - NO MISCHIEF INTENDED!
      </p>
    </footer>
  );
};
