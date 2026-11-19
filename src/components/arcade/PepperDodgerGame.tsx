"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { soundFx } from "@/lib/audio";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoBadge } from "@/components/ui/NeoBadge";

// Canvas Logical Dimensions
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 540;

interface Item {
  id: number;
  x: number;
  y: number;
  vy: number;
  type: "pepper" | "chocobi" | "milk" | "action_mask";
  rotation: number;
  rotSpeed: number;
  size: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface TextPopup {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

// ============================================================================
// VECTOR DRAWING HELPERS FOR CRISP NEO-BRUTALIST SPRITES (Zero Blurriness!)
// ============================================================================

function drawVectorPepper(ctx: CanvasRenderingContext2D, size: number) {
  const r = size * 0.55;
  ctx.save();

  // Hard shadow
  ctx.fillStyle = "rgba(30, 27, 24, 0.4)";
  ctx.beginPath();
  ctx.ellipse(3, 4, r * 0.85, r * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bell Pepper Main Body (Vibrant Green)
  ctx.fillStyle = "#29bf12";
  ctx.strokeStyle = "#1e1b18";
  ctx.lineWidth = 3.5;
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(-r * 0.65, -r * 0.35);
  ctx.bezierCurveTo(-r * 0.9, -r * 0.75, -r * 0.2, -r * 0.85, 0, -r * 0.55);
  ctx.bezierCurveTo(r * 0.2, -r * 0.85, r * 0.9, -r * 0.75, r * 0.65, -r * 0.35);
  ctx.bezierCurveTo(r * 0.95, r * 0.55, r * 0.45, r * 0.85, 0, r * 0.8);
  ctx.bezierCurveTo(-r * 0.45, r * 0.85, -r * 0.95, r * 0.55, -r * 0.65, -r * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Highlight shine (Lighter green)
  ctx.fillStyle = "#a8f387";
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.15, r * 0.22, r * 0.35, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Stem at top (Dark green with black outline)
  ctx.fillStyle = "#1b5e20";
  ctx.beginPath();
  ctx.moveTo(-r * 0.15, -r * 0.55);
  ctx.lineTo(-r * 0.05, -r * 0.95);
  ctx.lineTo(r * 0.25, -r * 0.9);
  ctx.lineTo(r * 0.15, -r * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Angry Evil Face on Pepper
  ctx.fillStyle = "#1e1b18";
  ctx.strokeStyle = "#1e1b18";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, -r * 0.05);
  ctx.lineTo(-r * 0.15, 0.05);
  ctx.moveTo(r * 0.45, -r * 0.05);
  ctx.lineTo(r * 0.15, 0.05);
  ctx.stroke();

  // Eyes
  ctx.beginPath();
  ctx.arc(-r * 0.28, r * 0.18, 2.5, 0, Math.PI * 2);
  ctx.arc(r * 0.28, r * 0.18, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawVectorChocobiStar(ctx: CanvasRenderingContext2D, size: number) {
  const r = size * 0.58;
  const innerR = r * 0.46;
  ctx.save();

  // Hard shadow
  ctx.fillStyle = "rgba(30, 27, 24, 0.4)";
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    const sx = Math.cos(outerAngle) * r + 3;
    const sy = Math.sin(outerAngle) * r + 4;
    const ix = Math.cos(innerAngle) * innerR + 3;
    const iy = Math.sin(innerAngle) * innerR + 4;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fill();

  // Star Body (Golden Yellow)
  ctx.fillStyle = "#ffd93d";
  ctx.strokeStyle = "#1e1b18";
  ctx.lineWidth = 3.5;
  ctx.lineJoin = "round";

  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    if (i === 0) {
      ctx.moveTo(Math.cos(outerAngle) * r, Math.sin(outerAngle) * r);
    } else {
      ctx.lineTo(Math.cos(outerAngle) * r, Math.sin(outerAngle) * r);
    }
    ctx.lineTo(Math.cos(innerAngle) * innerR, Math.sin(innerAngle) * innerR);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cute Happy Star Face
  ctx.fillStyle = "#1e1b18";
  ctx.beginPath();
  ctx.arc(-r * 0.22, -r * 0.05, 2.8, 0, Math.PI * 2);
  ctx.arc(r * 0.22, -r * 0.05, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = "#1e1b18";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, r * 0.06, r * 0.16, 0, Math.PI);
  ctx.stroke();

  // Cute Pink Blush
  ctx.fillStyle = "#ff6b8b";
  ctx.beginPath();
  ctx.arc(-r * 0.32, r * 0.12, 3, 0, Math.PI * 2);
  ctx.arc(r * 0.32, r * 0.12, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawVectorMilkCarton(ctx: CanvasRenderingContext2D, size: number) {
  const w = size * 0.72;
  const h = size * 0.95;
  ctx.save();

  // Hard shadow
  ctx.fillStyle = "rgba(30, 27, 24, 0.4)";
  ctx.fillRect(-w / 2 + 3, -h / 2 + 10 + 4, w, h - 10);

  ctx.strokeStyle = "#1e1b18";
  ctx.lineWidth = 3.5;
  ctx.lineJoin = "round";

  // Body
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-w / 2, -h / 2 + 10, w, h - 10);
  ctx.strokeRect(-w / 2, -h / 2 + 10, w, h - 10);

  // Gable top
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2 + 10);
  ctx.lineTo(0, -h / 2);
  ctx.lineTo(w / 2, -h / 2 + 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Blue stripe
  ctx.fillStyle = "#0b5eaf";
  ctx.fillRect(-w / 2, -h / 6, w, h * 0.36);
  ctx.strokeRect(-w / 2, -h / 6, w, h * 0.36);

  // Text "MILK"
  ctx.fillStyle = "#ffffff";
  ctx.font = '900 12px sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("MILK", 0, 0);

  ctx.restore();
}

function drawVectorActionBadge(ctx: CanvasRenderingContext2D, size: number) {
  const r = size * 0.58;
  ctx.save();

  // Hard shadow
  ctx.fillStyle = "rgba(30, 27, 24, 0.4)";
  ctx.beginPath();
  ctx.arc(3, 4, r, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring (Heroic cyan/blue)
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = "#0b5eaf";
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = "#1e1b18";
  ctx.stroke();

  // Inner ring (White)
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Golden Lightning Bolt
  ctx.fillStyle = "#ffd93d";
  ctx.strokeStyle = "#1e1b18";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "miter";
  ctx.beginPath();
  ctx.moveTo(r * 0.1, -r * 0.55);
  ctx.lineTo(-r * 0.38, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(-r * 0.1, r * 0.55);
  ctx.lineTo(r * 0.38, -0.05);
  ctx.lineTo(0, -0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function PepperDodgerGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [scoreDisplay, setScoreDisplay] = useState<number>(0);
  const [livesDisplay, setLivesDisplay] = useState<number>(3);
  const [highScore, setHighScore] = useState<number>(0);
  const [invincibleDisplay, setInvincibleDisplay] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preloaded Images
  const shinImgRef = useRef<HTMLImageElement | null>(null);

  // High Performance Mutable Game State (Zero React overhead in loop)
  const gameRef = useRef({
    score: 0,
    lives: 3,
    highScore: 0,
    playerX: CANVAS_WIDTH / 2,
    playerY: CANVAS_HEIGHT - 60,
    playerVx: 0,
    playerRadius: 32,
    isInvincible: false,
    invincibleEndTime: 0,
    isHurt: false,
    hurtEndTime: 0,
    items: [] as Item[],
    particles: [] as Particle[],
    popups: [] as TextPopup[],
    lastSpawnTime: 0,
    shakeTime: 0,
    keys: { left: false, right: false },
    isRunning: false,
  });

  // Preload Shin Avatar for Canvas
  useEffect(() => {
    if (typeof window !== "undefined") {
      const img = new window.Image();
      img.src = "/images/squad-1-a-playful-and-mischievous-5-ye.jpg";
      img.onload = () => {
        shinImgRef.current = img;
      };

      const saved = localStorage.getItem("shin_pepper_high_score");
      if (saved) {
        const val = parseInt(saved, 10) || 0;
        setHighScore(val);
        gameRef.current.highScore = val;
      }
    }
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        gameRef.current.keys.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        gameRef.current.keys.right = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        gameRef.current.keys.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        gameRef.current.keys.right = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Spawn Particle Bursts
  const spawnParticles = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = Math.random() * 180 + 60;
      gameRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 4,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.3,
      });
    }
  };

  // Spawn Floating Text Popup on Canvas
  const spawnPopup = (text: string, x: number, y: number, color: string) => {
    gameRef.current.popups.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -60,
    });
  };

  // Game Over Handler
  const handleGameOver = useCallback(() => {
    gameRef.current.isRunning = false;
    soundFx.playGameOver();
    setGameState("gameover");

    const finalScore = gameRef.current.score;
    if (finalScore > gameRef.current.highScore) {
      gameRef.current.highScore = finalScore;
      setHighScore(finalScore);
      if (typeof window !== "undefined") {
        localStorage.setItem("shin_pepper_high_score", String(finalScore));
      }
    }
  }, []);

  // Start / Restart Game
  const startGame = () => {
    soundFx.playSparkleChime();
    const g = gameRef.current;
    g.score = 0;
    g.lives = 3;
    g.playerX = CANVAS_WIDTH / 2;
    g.playerVx = 0;
    g.isInvincible = false;
    g.invincibleEndTime = 0;
    g.isHurt = false;
    g.hurtEndTime = 0;
    g.items = [];
    g.particles = [];
    g.popups = [];
    g.lastSpawnTime = performance.now();
    g.shakeTime = 0;
    g.isRunning = true;

    setScoreDisplay(0);
    setLivesDisplay(3);
    setInvincibleDisplay(0);
    setGameState("playing");
  };

  // Mouse / Touch Move Control on Canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!gameRef.current.isRunning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const clientX = e.clientX - rect.left;
    const targetX = clientX * scaleX;
    gameRef.current.playerX = Math.max(45, Math.min(CANVAS_WIDTH - 45, targetX));
  };

  // Main High Performance 60FPS Hardware-Accelerated Canvas Game Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let animId: number;
    let lastTime = performance.now();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // HiDPI / Retina Crisp Scaling
    const dpr = typeof window !== "undefined" ? Math.max(1, window.devicePixelRatio || 1) : 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const game = gameRef.current;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!game.isRunning) return;

      // 1. UPDATE PHYSICS
      // Movement via keyboard keys (with smooth acceleration)
      const moveSpeed = game.isInvincible ? 650 : 520;
      if (game.keys.left) {
        game.playerX -= moveSpeed * dt;
      }
      if (game.keys.right) {
        game.playerX += moveSpeed * dt;
      }
      game.playerX = Math.max(45, Math.min(CANVAS_WIDTH - 45, game.playerX));

      // Invincible timer
      if (game.isInvincible) {
        const remaining = Math.max(0, Math.ceil((game.invincibleEndTime - now) / 1000));
        setInvincibleDisplay(remaining);
        if (now >= game.invincibleEndTime) {
          game.isInvincible = false;
          setInvincibleDisplay(0);
        }
      }

      // Hurt timer
      if (game.isHurt && now >= game.hurtEndTime) {
        game.isHurt = false;
      }

      // Spawn falling items
      const spawnInterval = Math.max(350, 850 - Math.floor(game.score / 50) * 45);
      if (now - game.lastSpawnTime > spawnInterval) {
        game.lastSpawnTime = now;
        const rand = Math.random();
        let itemType: Item["type"] = "pepper";
        if (rand < 0.55) itemType = "pepper";
        else if (rand < 0.85) itemType = "chocobi";
        else if (rand < 0.95) itemType = "milk";
        else itemType = "action_mask";

        const baseFallSpeed = 160 + Math.min(260, Math.floor(game.score / 40) * 15);

        game.items.push({
          id: now + Math.random(),
          x: Math.random() * (CANVAS_WIDTH - 120) + 60,
          y: -45,
          vy: baseFallSpeed + (Math.random() * 40 - 20),
          type: itemType,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 3,
          size: itemType === "action_mask" ? 46 : 42,
        });
      }

      // Update falling items & collision
      const remainingItems: Item[] = [];
      const px = game.playerX;
      const py = game.playerY;
      const pr = game.playerRadius;

      for (const item of game.items) {
        item.y += item.vy * dt;
        item.rotation += item.rotSpeed * dt;

        // Collision check (circle vs circle)
        const dx = item.x - px;
        const dy = item.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < pr + item.size * 0.45) {
          // Collided!
          if (item.type === "pepper") {
            if (game.isInvincible) {
              soundFx.playTroubleBoing();
              game.score += 15;
              setScoreDisplay(game.score);
              spawnParticles(item.x, item.y, "#29bf12", 14);
              spawnPopup("+15 CRUSH! 🫑", item.x, item.y, "#29bf12");
            } else {
              soundFx.playHitPepper();
              game.isHurt = true;
              game.hurtEndTime = now + 400;
              game.shakeTime = 0.25;
              spawnParticles(item.x, item.y, "#b7000c", 16);
              spawnPopup("OUCH! 🫑", item.x, item.y, "#b7000c");

              game.lives -= 1;
              setLivesDisplay(game.lives);
              if (game.lives <= 0) {
                handleGameOver();
                return;
              }
            }
          } else if (item.type === "chocobi") {
            soundFx.playSparkleChime();
            game.score += 10;
            setScoreDisplay(game.score);
            spawnParticles(item.x, item.y, "#ffd93d", 12);
            spawnPopup("+10 CHOCOBI! ⭐", item.x, item.y, "#ffd93d");
          } else if (item.type === "milk") {
            soundFx.playSparkleChime();
            game.score += 20;
            setScoreDisplay(game.score);
            spawnParticles(item.x, item.y, "#0b5eaf", 12);
            spawnPopup("+20 MILK! 🥛", item.x, item.y, "#0b5eaf");
          } else if (item.type === "action_mask") {
            soundFx.playPowerUp();
            soundFx.playActionBeam();
            game.score += 50;
            setScoreDisplay(game.score);
            game.isInvincible = true;
            game.invincibleEndTime = now + 6000;
            spawnParticles(item.x, item.y, "#f4e700", 20);
            spawnPopup("⚡ ACTION MODE! ⚡", item.x, item.y, "#f4e700");
          }
          continue;
        }

        if (item.y < CANVAS_HEIGHT + 60) {
          remainingItems.push(item);
        }
      }
      game.items = remainingItems;

      // Update Particles
      for (let i = game.particles.length - 1; i >= 0; i--) {
        const p = game.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          game.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha = 1 - p.life / p.maxLife;
      }

      // Update Popups
      for (let i = game.popups.length - 1; i >= 0; i--) {
        const pop = game.popups[i];
        pop.y += pop.vy * dt;
        pop.alpha -= dt * 1.5;
        if (pop.alpha <= 0) {
          game.popups.splice(i, 1);
        }
      }

      // 2. RENDER STAGE (GPU Hardware Accelerated HiDPI 60FPS)
      ctx.save();
      // Apply Retina / HiDPI Transform
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Screen Shake when hurt
      if (game.shakeTime > 0) {
        game.shakeTime -= dt;
        const mag = 8;
        ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
      }

      // Background Sky
      if (game.isInvincible) {
        ctx.fillStyle = "#fff8db";
      } else if (game.isHurt) {
        ctx.fillStyle = "#ffdad6";
      } else {
        ctx.fillStyle = "#eaf4fb";
      }
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Halftone Comic Grid Pattern (pure Canvas)
      ctx.fillStyle = game.isInvincible ? "rgba(255, 217, 61, 0.25)" : "rgba(11, 94, 175, 0.12)";
      for (let gx = 15; gx < CANVAS_WIDTH; gx += 30) {
        for (let gy = 15; gy < CANVAS_HEIGHT; gy += 30) {
          ctx.beginPath();
          ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Ground Line (Neo-Brutalist 4px black ink)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 30);
      ctx.fillStyle = "#1e1b18";
      ctx.fillRect(0, CANVAS_HEIGHT - 32, CANVAS_WIDTH, 4);

      // Ground Hatch Pattern
      ctx.strokeStyle = "rgba(30, 27, 24, 0.15)";
      ctx.lineWidth = 2;
      for (let hx = -CANVAS_HEIGHT; hx < CANVAS_WIDTH; hx += 16) {
        ctx.beginPath();
        ctx.moveTo(hx, CANVAS_HEIGHT);
        ctx.lineTo(hx + 30, CANVAS_HEIGHT - 30);
        ctx.stroke();
      }

      // Draw Falling Items with Crisp Vector Graphics (Zero Blurriness!)
      for (const item of game.items) {
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        if (item.type === "pepper") {
          drawVectorPepper(ctx, item.size);
        } else if (item.type === "chocobi") {
          drawVectorChocobiStar(ctx, item.size);
        } else if (item.type === "milk") {
          drawVectorMilkCarton(ctx, item.size);
        } else if (item.type === "action_mask") {
          drawVectorActionBadge(ctx, item.size);
        }

        ctx.restore();
      }

      // Draw Particles
      for (const p of game.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = "#1e1b18";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Draw Shin-chan Player
      ctx.save();
      ctx.translate(game.playerX, game.playerY);

      // Invincible Pulsing Aura
      if (game.isInvincible) {
        const pulse = Math.sin(now * 0.015) * 8 + 40;
        ctx.beginPath();
        ctx.arc(0, 0, pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244, 231, 0, 0.4)";
        ctx.fill();

        ctx.strokeStyle = "#ffd93d";
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Player Shadow
      ctx.beginPath();
      ctx.ellipse(0, 32, 28, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(30, 27, 24, 0.35)";
      ctx.fill();

      // Shin Circular Avatar Portrait
      const r = game.playerRadius;
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.clip();

      if (shinImgRef.current && shinImgRef.current.complete) {
        ctx.drawImage(shinImgRef.current, -r, -r, r * 2, r * 2);
      } else {
        ctx.fillStyle = "#b7000c";
        ctx.fillRect(-r, -r, r * 2, r * 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SHIN", 0, 0);
      }

      // Hurt Red Overlay
      if (game.isHurt) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.45)";
        ctx.fillRect(-r, -r, r * 2, r * 2);
      }
      ctx.restore();

      // Bold Neo-Brutalist Ink Border around Shin
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = game.isInvincible ? "#0b5eaf" : "#1e1b18";
      ctx.stroke();

      // Status Tag Below Shin
      const tagText = game.isInvincible ? "ACTION SHIN!" : game.isHurt ? "OUCH! 😭" : "SHIN-CHAN";
      ctx.font = "bold 11px sans-serif";
      const tagWidth = ctx.measureText(tagText).width + 12;

      ctx.fillStyle = "#1e1b18";
      ctx.fillRect(-tagWidth / 2 + 2, r + 4 + 2, tagWidth, 18);
      ctx.fillStyle = game.isInvincible ? "#ffd93d" : game.isHurt ? "#b7000c" : "#ffffff";
      ctx.fillRect(-tagWidth / 2, r + 4, tagWidth, 18);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#1e1b18";
      ctx.strokeRect(-tagWidth / 2, r + 4, tagWidth, 18);

      ctx.fillStyle = game.isHurt ? "#ffffff" : "#1e1b18";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tagText, 0, r + 13);

      ctx.restore();

      // Draw Floating Text Popups (Opaque & High Contrast)
      for (const pop of game.popups) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pop.alpha);
        ctx.font = '900 16px "Bricolage Grotesque", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const pWidth = ctx.measureText(pop.text).width + 16;
        // Hard drop shadow
        ctx.fillStyle = "#1e1b18";
        ctx.fillRect(pop.x - pWidth / 2 + 3, pop.y - 12 + 3, pWidth, 26);
        // Solid Box Fill
        ctx.fillStyle = pop.color;
        ctx.fillRect(pop.x - pWidth / 2, pop.y - 12, pWidth, 26);
        ctx.strokeStyle = "#1e1b18";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(pop.x - pWidth / 2, pop.y - 12, pWidth, 26);

        // Bold black text
        ctx.fillStyle = "#1e1b18";
        ctx.fillText(pop.text, pop.x, pop.y + 1);
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gameState, handleGameOver]);

  return (
    <div className="bg-surface neo-brutalist-border hard-shadow p-4 sm:p-6 rounded-none space-y-4 max-w-4xl mx-auto select-none">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-on-background pb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🫑</span>
          <div>
            <h2 className="font-display-md text-xl sm:text-2xl uppercase tracking-wider text-primary">
              Green Pepper Dodger
            </h2>
            <p className="font-caption text-xs text-on-surface-variant font-bold">
              Bé Shin Né Ớt Chuông • Vector Neo-Brutalist Engine (Siêu Nét 60FPS)
            </p>
          </div>
        </div>

        {/* Top Badges */}
        <div className="flex items-center gap-2">
          <NeoBadge variant="tertiary" rotate={2} className="text-xs px-3 py-1 font-mono">
            🏆 BEST: {highScore}
          </NeoBadge>
          <NeoBadge variant="primary" rotate={-2} className="text-xs px-3 py-1 font-mono">
            ⭐ SCORE: {scoreDisplay}
          </NeoBadge>
        </div>
      </div>

      {/* Main Canvas Game Stage */}
      <div className="relative w-full aspect-[800/540] neo-brutalist-border overflow-hidden bg-[#eaf4fb]">
        {/* HUD Overlay inside Canvas */}
        <div className="absolute top-3 left-4 text-xs font-mono font-bold text-on-surface-variant/70 uppercase pointer-events-none select-none z-10">
          Kasukabe Airspace • HiDPI Vector
        </div>

        {/* Lives & Invincible Indicator */}
        <div className="absolute top-3 right-4 flex items-center gap-2 z-10 pointer-events-none select-none">
          {invincibleDisplay > 0 && (
            <span className="bg-secondary text-white font-label-bold text-xs px-2.5 py-1 neo-brutalist-border animate-pulse shadow-sm">
              ⚡ ACTION MASK: {invincibleDisplay}s
            </span>
          )}
          <div className="bg-white neo-brutalist-border px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-xs font-bold mr-1">LIVES:</span>
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`text-base transition-opacity ${
                  i < livesDisplay ? "opacity-100 scale-100" : "opacity-20 grayscale"
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* The Hardware-Accelerated 60FPS Canvas */}
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          className="w-full h-full block cursor-ew-resize touch-none"
        />

        {/* IDLE Screen Overlay */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 z-40">
            <div className="text-6xl animate-bounce">🫑🚫</div>
            <h3 className="font-display-lg text-2xl sm:text-4xl text-primary uppercase leading-tight">
              BÉ SHIN NÉ ỚT CHUÔNG
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md">
              Ớt chuông xanh đang rơi như mưa! Dùng phím <strong>← →</strong>, phím <strong>A / D</strong>, hoặc rê chuột/vuốt màn hình để giúp Shin né ớt, đớp bánh Chocobi ⭐ và nhặt Huy Hiệu Siêu Nhân ⚡!
            </p>

            <div className="flex flex-wrap justify-center gap-2.5 text-xs font-mono font-bold pt-1">
              <span className="bg-surface-container px-2.5 py-1 neo-brutalist-border">🫑 Né Tránh (-1 Tim)</span>
              <span className="bg-tertiary-fixed px-2.5 py-1 neo-brutalist-border">⭐ Chocobi (+10đ)</span>
              <span className="bg-secondary-fixed px-2.5 py-1 neo-brutalist-border">⚡ Siêu Nhân (+50đ & Bất tử)</span>
            </div>

            <NeoButton variant="primary" size="lg" onClick={startGame}>
              BẮT ĐẦU CHƠI NGAY! 🎮
            </NeoButton>
          </div>
        )}

        {/* GAME OVER Screen Overlay */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 z-40 animate-in fade-in duration-200">
            <div className="text-5xl">😭🍽️</div>
            <h3 className="font-display-lg text-3xl sm:text-4xl text-error uppercase leading-tight">
              GAME OVER!
            </h3>
            <p className="font-body-md text-sm text-white max-w-md italic">
              &ldquo;Mẹ Misae bắt được rồi! Bắt Shin ăn hết đĩa ớt chuông rồi mới được xem Action Mask!&rdquo;
            </p>

            <div className="bg-surface neo-brutalist-border hard-shadow p-4 w-full max-w-xs space-y-2">
              <div className="flex justify-between font-label-bold text-xs uppercase text-on-surface-variant">
                <span>Điểm của bạn:</span>
                <span className="font-mono text-primary font-bold text-lg">{scoreDisplay}</span>
              </div>
              <div className="flex justify-between font-label-bold text-xs uppercase text-on-surface-variant">
                <span>Kỷ lục cao nhất:</span>
                <span className="font-mono text-secondary font-bold text-lg">{highScore}</span>
              </div>
              {scoreDisplay >= highScore && scoreDisplay > 0 && (
                <div className="bg-tertiary-fixed text-on-tertiary-fixed font-label-bold text-[11px] py-1 neo-brutalist-border uppercase">
                  🎉 KỶ LỤC MỚI CỦA BẠN!
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <NeoButton variant="tertiary" size="md" onClick={startGame}>
                CHƠI LẠI NGAY 🔄
              </NeoButton>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Touch Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:hidden pt-1">
        <button
          onTouchStart={() => {
            gameRef.current.keys.left = true;
          }}
          onTouchEnd={() => {
            gameRef.current.keys.left = false;
          }}
          onMouseDown={() => {
            gameRef.current.keys.left = true;
          }}
          onMouseUp={() => {
            gameRef.current.keys.left = false;
          }}
          className="py-3.5 bg-secondary text-white neo-brutalist-border hard-shadow active:translate-y-1 font-label-bold text-sm uppercase flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          ⬅️ CHẠY TRÁI
        </button>
        <button
          onTouchStart={() => {
            gameRef.current.keys.right = true;
          }}
          onTouchEnd={() => {
            gameRef.current.keys.right = false;
          }}
          onMouseDown={() => {
            gameRef.current.keys.right = true;
          }}
          onMouseUp={() => {
            gameRef.current.keys.right = false;
          }}
          className="py-3.5 bg-primary text-white neo-brutalist-border hard-shadow active:translate-y-1 font-label-bold text-sm uppercase flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          CHẠY PHẢI ➡️
        </button>
      </div>

      {/* Control Tips */}
      <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant font-medium pt-1 border-t border-on-background/10">
        <span>🎮 <strong>Điều khiển:</strong> Dùng phím mũi tên [←] [→], phím A / D hoặc rê chuột/vuốt ngón tay.</span>
        <span>⚡ Ăn Huy hiệu Siêu Nhân để húc bay ớt chuông!</span>
      </div>
    </div>
  );
}
