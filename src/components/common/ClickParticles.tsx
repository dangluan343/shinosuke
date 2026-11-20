"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  alpha: number;
  type: "star" | "paw" | "kiss" | "spark";
  color: string;
}

export function ClickParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const types: Particle["type"][] = ["star", "paw", "kiss", "spark"];
    const colors = ["#ffd200", "#e60012", "#ff69b4", "#00d26a", "#00b4d8", "#ffffff"];

    const addParticles = (x: number, y: number) => {
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const count = 5 + Math.floor(Math.random() * 4); // 5-8 hạt mỗi lần click

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5, // hơi bay nhẹ lên trên
          size: 10 + Math.random() * 8,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          alpha: 1,
          type: chosenType,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      if (!animFrameRef.current) {
        loop();
      }
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          return;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      addParticles(clientX, clientY);
    };

    window.addEventListener("pointerdown", handleClick, { passive: true });

    // Vẽ hình ngôi sao Chocobi
    const drawStar = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.strokeStyle = "#1e1b18";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * r, -Math.sin(((18 + i * 72) * Math.PI) / 180) * r);
        ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (r * 0.45), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r * 0.45));
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    // Vẽ dấu chân Shiro cute
    const drawPaw = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.strokeStyle = "#1e1b18";
      ctx.lineWidth = 1.5;

      // Đệm chân to
      ctx.beginPath();
      ctx.ellipse(0, r * 0.2, r * 0.55, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 3 ngón chân nhỏ
      const toes = [-r * 0.4, 0, r * 0.4];
      toes.forEach((tx) => {
        ctx.beginPath();
        ctx.ellipse(tx, -r * 0.4, r * 0.2, r * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      ctx.restore();
    };

    // Vẽ môi hôn / trái tim Shin-chan
    const drawKiss = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.strokeStyle = "#1e1b18";
      ctx.lineWidth = 1.5;

      // Hình đôi môi cartoon
      ctx.beginPath();
      ctx.arc(-r * 0.35, 0, r * 0.4, Math.PI, 0, false);
      ctx.arc(r * 0.35, 0, r * 0.4, Math.PI, 0, false);
      ctx.quadraticCurveTo(0, r * 0.7, -r * 0.7, 0);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    // Vẽ tia sáng / manga sparkle
    const drawSpark = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.strokeStyle = "#1e1b18";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeParticles: Particle[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // trọng lực nhẹ
        p.rotation += p.vRot;
        p.alpha -= 0.025; // giảm dần sau ~40 frames (~0.6s)

        if (p.alpha > 0.01) {
          activeParticles.push(p);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          if (p.type === "star") {
            drawStar(0, 0, p.size, p.color, p.alpha);
          } else if (p.type === "paw") {
            drawPaw(0, 0, p.size, p.color, p.alpha);
          } else if (p.type === "kiss") {
            drawKiss(0, 0, p.size, p.color, p.alpha);
          } else {
            drawSpark(0, 0, p.size, p.color, p.alpha);
          }

          ctx.restore();
        }
      }

      particlesRef.current = activeParticles;

      if (activeParticles.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        animFrameRef.current = null;
      }
    };

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handleClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99998]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

export default ClickParticles;
