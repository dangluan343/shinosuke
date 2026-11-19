"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { soundFx } from "@/lib/audio";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoBadge } from "@/components/ui/NeoBadge";

interface FallingItem {
  id: number;
  x: number; // percentage 5% to 90%
  y: number; // percentage 0% to 100%
  speed: number;
  type: "pepper" | "chocobi" | "milk" | "action_mask";
  rotation: number;
  size: number;
}

const GAME_WIDTH = 640;
const GAME_HEIGHT = 460;

export function PepperDodgerGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isInvincible, setIsInvincible] = useState<boolean>(false);
  const [invincibleTimeLeft, setInvincibleTimeLeft] = useState<number>(0);
  const [playerX, setPlayerX] = useState<number>(50); // percentage 5% to 90%
  const [isHurt, setIsHurt] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);

  // Floating score popups
  const [popups, setPopups] = useState<Array<{ id: number; text: string; x: number; y: number; color: string }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<FallingItem[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnTime = useRef<number>(0);
  const playerXRef = useRef<number>(50);
  const livesRef = useRef<number>(3);
  const isInvincibleRef = useRef<boolean>(false);
  const scoreRef = useRef<number>(0);
  const keysPressed = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  // Sync refs
  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    isInvincibleRef.current = isInvincible;
  }, [isInvincible]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Load High Score
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shin_pepper_high_score");
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0);
      }
    }
  }, []);

  const addPopup = (text: string, x: number, y: number, color: string) => {
    const id = Date.now() + Math.random();
    setPopups((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 800);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysPressed.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysPressed.current.right = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysPressed.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysPressed.current.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Touch / Mouse move controls on the arena
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "playing" || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(6, Math.min(92, relX)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState !== "playing" || !containerRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = ((touch.clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(6, Math.min(92, relX)));
  };

  // Start / Restart Game
  const startGame = () => {
    soundFx.playSparkleChime();
    setScore(0);
    setLives(3);
    setCombo(0);
    setIsInvincible(false);
    setInvincibleTimeLeft(0);
    setPlayerX(50);
    itemsRef.current = [];
    lastSpawnTime.current = Date.now();
    setGameState("playing");
  };

  const gameOver = useCallback(() => {
    soundFx.playGameOver();
    setGameState("gameover");
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      if (typeof window !== "undefined") {
        localStorage.setItem("shin_pepper_high_score", String(scoreRef.current));
      }
    }
  }, [highScore]);

  // Main Game Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Handle keyboard movement
      if (keysPressed.current.left) {
        setPlayerX((prev) => Math.max(6, prev - 75 * delta));
      }
      if (keysPressed.current.right) {
        setPlayerX((prev) => Math.min(92, prev + 75 * delta));
      }

      // Spawn falling items
      const now = Date.now();
      const spawnInterval = Math.max(450, 1000 - Math.floor(scoreRef.current / 50) * 50);

      if (now - lastSpawnTime.current > spawnInterval) {
        lastSpawnTime.current = now;

        const rand = Math.random();
        let itemType: FallingItem["type"] = "pepper";

        if (rand < 0.55) {
          itemType = "pepper";
        } else if (rand < 0.85) {
          itemType = "chocobi";
        } else if (rand < 0.95) {
          itemType = "milk";
        } else {
          itemType = "action_mask";
        }

        const baseSpeed = 30 + Math.min(50, Math.floor(scoreRef.current / 40) * 5);

        itemsRef.current.push({
          id: now + Math.random(),
          x: Math.random() * 84 + 8, // 8% to 92%
          y: -5,
          speed: baseSpeed + (Math.random() * 15 - 7),
          type: itemType,
          rotation: Math.random() * 360,
          size: itemType === "action_mask" ? 42 : 36,
        });
      }

      // Update positions & check collisions
      const currentItems = [...itemsRef.current];
      const nextItems: FallingItem[] = [];
      const pX = playerXRef.current;
      const pY = 82; // Shin is near bottom
      const pRadius = 7.5; // collision radius in percentage

      for (const item of currentItems) {
        item.y += item.speed * delta;
        item.rotation += 45 * delta;

        // Collision check
        const distX = Math.abs(item.x - pX);
        const distY = Math.abs(item.y - pY);

        if (distX < pRadius && distY < 8) {
          // Collided with player!
          if (item.type === "pepper") {
            if (isInvincibleRef.current) {
              // Destroy pepper in action mode!
              soundFx.playTroubleBoing();
              setScore((s) => s + 15);
              addPopup("+15 CRUSH!", item.x, item.y, "#29bf12");
            } else {
              // Hurt!
              soundFx.playHitPepper();
              setIsHurt(true);
              setTimeout(() => setIsHurt(false), 400);
              setCombo(0);
              addPopup("OUCH! 🫑", item.x, item.y, "#b7000c");

              const newLives = livesRef.current - 1;
              setLives(newLives);
              if (newLives <= 0) {
                gameOver();
                return;
              }
            }
          } else if (item.type === "chocobi") {
            soundFx.playSparkleChime();
            setScore((s) => s + 10);
            setCombo((c) => c + 1);
            addPopup("+10 CHOCOBI! ⭐", item.x, item.y, "#ffd93d");
          } else if (item.type === "milk") {
            soundFx.playSparkleChime();
            setScore((s) => s + 20);
            addPopup("+20 MILK! 🥛", item.x, item.y, "#0b5eaf");
          } else if (item.type === "action_mask") {
            soundFx.playPowerUp();
            soundFx.playActionBeam();
            setScore((s) => s + 50);
            setIsInvincible(true);
            setInvincibleTimeLeft(6);
            addPopup("⚡ ACTION MODE ⚡", item.x, item.y, "#f4e700");
          }
          continue; // Item collected/hit, don't keep in list
        }

        // Keep item if still on screen
        if (item.y < 105) {
          nextItems.push(item);
        }
      }

      itemsRef.current = nextItems;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameState, gameOver]);

  // Invincible timer countdown
  useEffect(() => {
    if (!isInvincible) return;
    const interval = setInterval(() => {
      setInvincibleTimeLeft((prev) => {
        if (prev <= 1) {
          setIsInvincible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isInvincible]);

  return (
    <div className="bg-surface neo-brutalist-border hard-shadow p-4 sm:p-6 rounded-none space-y-4 max-w-3xl mx-auto select-none">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-on-background pb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🫑</span>
          <div>
            <h2 className="font-display-md text-xl sm:text-2xl uppercase tracking-wider text-primary">
              Green Pepper Dodger
            </h2>
            <p className="font-caption text-xs text-on-surface-variant font-bold">
              Bé Shin Né Ớt Chuông • Ăn Chocobi Bất Tử
            </p>
          </div>
        </div>

        {/* Top Badges */}
        <div className="flex items-center gap-2">
          <NeoBadge variant="tertiary" rotate={2} className="text-xs px-3 py-1 font-mono">
            🏆 BEST: {highScore}
          </NeoBadge>
          <NeoBadge variant="primary" rotate={-2} className="text-xs px-3 py-1 font-mono">
            ⭐ SCORE: {score}
          </NeoBadge>
        </div>
      </div>

      {/* Main Game Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className={`relative w-full aspect-[4/3] sm:h-[420px] neo-brutalist-border overflow-hidden cursor-crosshair transition-colors duration-300 ${
          isInvincible
            ? "bg-tertiary-fixed shadow-[inset_0_0_20px_#ffd93d]"
            : isHurt
            ? "bg-error-container"
            : "bg-[#eaf4fb]"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(#0b5eaf 1px, transparent 1px), radial-gradient(#0b5eaf 1px, #eaf4fb 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      >
        {/* Sky Clouds / Comic Lines */}
        <div className="absolute top-3 left-4 text-xs font-mono font-bold text-on-surface-variant/70 uppercase">
          Kasukabe Airspace • Level: {Math.floor(score / 50) + 1}
        </div>

        {/* Lives & Invincible Indicator */}
        <div className="absolute top-3 right-4 flex items-center gap-2 z-10">
          {isInvincible && (
            <span className="bg-secondary text-white font-label-bold text-xs px-2.5 py-1 neo-brutalist-border animate-pulse shadow-sm">
              ⚡ ACTION MASK: {invincibleTimeLeft}s
            </span>
          )}
          <div className="bg-white neo-brutalist-border px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-xs font-bold mr-1">LIVES:</span>
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`text-base transition-opacity ${
                  i < lives ? "opacity-100 scale-100" : "opacity-20 grayscale"
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Floating Popups */}
        {popups.map((p) => (
          <div
            key={p.id}
            className="absolute font-display-md text-sm sm:text-base font-black px-2 py-0.5 pointer-events-none neo-brutalist-border animate-bounce"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              color: "#1e1b18",
              transform: "translate(-50%, -50%)",
              zIndex: 30,
            }}
          >
            {p.text}
          </div>
        ))}

        {/* Falling Items */}
        {gameState === "playing" &&
          itemsRef.current.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none flex items-center justify-center transition-transform"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.size}px`,
                height: `${item.size}px`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                zIndex: 15,
              }}
            >
              {item.type === "pepper" && (
                <div className="text-3xl filter drop-shadow-[2px_2px_0px_#1e1b18]">🫑</div>
              )}
              {item.type === "chocobi" && (
                <div className="text-3xl filter drop-shadow-[2px_2px_0px_#1e1b18]">⭐</div>
              )}
              {item.type === "milk" && (
                <div className="text-2xl filter drop-shadow-[2px_2px_0px_#1e1b18]">🥛</div>
              )}
              {item.type === "action_mask" && (
                <div className="text-3xl filter drop-shadow-[3px_3px_0px_#0b5eaf] animate-spin">
                  ⚡
                </div>
              )}
            </div>
          ))}

        {/* Shin-chan Player */}
        {gameState === "playing" && (
          <div
            className={`absolute bottom-4 flex flex-col items-center pointer-events-none transition-all duration-75 ${
              isInvincible ? "scale-125" : isHurt ? "animate-pulse scale-90" : ""
            }`}
            style={{
              left: `${playerX}%`,
              transform: "translateX(-50%)",
              zIndex: 20,
            }}
          >
            {/* Shin-chan Avatar */}
            <div
              className={`w-14 h-14 rounded-full neo-brutalist-border overflow-hidden relative shadow-md ${
                isInvincible ? "ring-4 ring-tertiary ring-offset-2 bg-secondary" : "bg-primary"
              }`}
            >
              <Image
                src="/images/squad-1-a-playful-and-mischievous-5-ye.jpg"
                alt="Shin-chan Dodger"
                fill
                className={`object-cover ${isHurt ? "grayscale" : ""}`}
              />
            </div>
            {/* Name/Status tag */}
            <span
              className={`font-label-bold text-[10px] px-2 py-0.5 mt-1 neo-brutalist-border shadow-xs uppercase ${
                isInvincible
                  ? "bg-secondary text-white"
                  : isHurt
                  ? "bg-error text-white"
                  : "bg-white text-on-background"
              }`}
            >
              {isInvincible ? "ACTION SHIN!" : isHurt ? "OUCH! 😭" : "SHIN-CHAN"}
            </span>
          </div>
        )}

        {/* IDLE Screen Overlay */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 z-40">
            <div className="text-6xl animate-bounce">🫑🚫</div>
            <h3 className="font-display-lg text-2xl sm:text-3xl text-primary uppercase">
              BÉ SHIN NÉ ỚT CHUÔNG
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md">
              Ớt chuông xanh đang rơi như mưa! Dùng phím mũi tên <strong>← →</strong> hoặc rê chuột/vuốt màn hình để giúp Shin né ớt, đớp bánh Chocobi ⭐ và nhặt Huy Hiệu Siêu Nhân ⚡!
            </p>

            <div className="flex flex-wrap justify-center gap-3 text-xs font-mono font-bold pt-1">
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 z-40 animate-in fade-in duration-200">
            <div className="text-5xl">😭🍽️</div>
            <h3 className="font-display-lg text-3xl sm:text-4xl text-error uppercase">
              GAME OVER!
            </h3>
            <p className="font-body-md text-sm text-white max-w-md italic">
              &ldquo;Mẹ Misae bắt được rồi! Bắt Shin ăn hết đĩa ớt chuông rồi mới được xem Action Mask!&rdquo;
            </p>

            <div className="bg-surface neo-brutalist-border hard-shadow p-4 w-full max-w-xs space-y-2">
              <div className="flex justify-between font-label-bold text-xs uppercase text-on-surface-variant">
                <span>Điểm của bạn:</span>
                <span className="font-mono text-primary font-bold text-base">{score}</span>
              </div>
              <div className="flex justify-between font-label-bold text-xs uppercase text-on-surface-variant">
                <span>Kỷ lục cao nhất:</span>
                <span className="font-mono text-secondary font-bold text-base">{highScore}</span>
              </div>
              {score >= highScore && score > 0 && (
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

      {/* Mobile Virtual Controls */}
      {gameState === "playing" && (
        <div className="grid grid-cols-2 gap-3 sm:hidden pt-1">
          <button
            onTouchStart={() => {
              keysPressed.current.left = true;
            }}
            onTouchEnd={() => {
              keysPressed.current.left = false;
            }}
            onMouseDown={() => {
              keysPressed.current.left = true;
            }}
            onMouseUp={() => {
              keysPressed.current.left = false;
            }}
            className="py-3 bg-secondary text-white neo-brutalist-border hard-shadow active:translate-y-1 font-label-bold text-sm uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            ⬅️ CHẠY TRÁI
          </button>
          <button
            onTouchStart={() => {
              keysPressed.current.right = true;
            }}
            onTouchEnd={() => {
              keysPressed.current.right = false;
            }}
            onMouseDown={() => {
              keysPressed.current.right = true;
            }}
            onMouseUp={() => {
              keysPressed.current.right = false;
            }}
            className="py-3 bg-primary text-white neo-brutalist-border hard-shadow active:translate-y-1 font-label-bold text-sm uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            CHẠY PHẢI ➡️
          </button>
        </div>
      )}

      {/* Control Tips */}
      <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant font-medium pt-1 border-t border-on-background/10">
        <span>🎮 <strong>Điều khiển:</strong> Dùng phím mũi tên [←] [→], phím A / D hoặc rê chuột.</span>
        <span>⚡ Ăn Huy hiệu Siêu Nhân để húc bay ớt chuông!</span>
      </div>
    </div>
  );
}

