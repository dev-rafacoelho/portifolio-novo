"use client";
import { useEffect, useRef } from "react";

/**
 * Fundo em canvas: grade de pixels que "acende" ao redor do cursor.
 * Respeita prefers-reduced-motion (fica estático) e dark mode (lê a classe `dark` no <html>).
 */
export default function PixelGrid({ cell = 18, radius = 160 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    // ---- Pong automático (em unidades de célula) ----
    const pong = {
      ball: { x: 0, y: 0, vx: 0, vy: 0 },
      left: { y: 0, err: 0 },
      right: { y: 0, err: 0 },
      score: [0, 0],
      cols: 0,
      rows: 0,
      paddle: 5, // altura do goleiro em células
      wait: 0, // frames parado após gol
    };

    const serve = (dir) => {
      pong.ball.x = pong.cols / 2;
      pong.ball.y = pong.rows / 2;
      // saque sempre em diagonal forte (35° a 55°), pra cima ou pra baixo
      const angle = (0.6 + Math.random() * 0.35) * (Math.random() < 0.5 ? 1 : -1);
      const speed = 0.32;
      pong.ball.vx = Math.cos(angle) * speed * dir;
      pong.ball.vy = Math.sin(angle) * speed;
      pong.wait = 45;
      pong.left.err = (Math.random() - 0.5) * pong.paddle * 1.6;
      pong.right.err = (Math.random() - 0.5) * pong.paddle * 1.6;
    };

    const stepPong = () => {
      if (pong.wait > 0) {
        pong.wait--;
        return;
      }
      const b = pong.ball;
      b.x += b.vx;
      b.y += b.vy;

      // paredes
      if (b.y < 0) { b.y = 0; b.vy *= -1; }
      if (b.y > pong.rows - 1) { b.y = pong.rows - 1; b.vy *= -1; }

      // goleiros perseguem a bola (com limite de velocidade -> às vezes falham)
      // goleiro reage só quando a bola está no seu campo, com erro de mira
      const chase = (p, active) => {
        const target = b.y - pong.paddle / 2 + p.err;
        const maxV = active ? 0.2 : 0.06;
        const diff = target - p.y;
        p.y += Math.max(-maxV, Math.min(maxV, diff));
        p.y = Math.max(0, Math.min(pong.rows - pong.paddle, p.y));
      };
      chase(pong.left, b.vx < 0 && b.x < pong.cols * 0.55);
      chase(pong.right, b.vx > 0 && b.x > pong.cols * 0.45);

      // colisão com goleiros
      const hit = (p, px) => {
        if (b.y + 1 < p.y || b.y > p.y + pong.paddle) return false;
        const rel = (b.y - (p.y + pong.paddle / 2)) / (pong.paddle / 2);
        const speed = Math.min(Math.hypot(b.vx, b.vy) * 1.04, 0.7);
        // garante diagonal: nunca rebate "reto"
        const ang = Math.max(0.45, Math.abs(rel) * 1.1) * Math.sign(rel || (Math.random() < 0.5 ? 1 : -1));
        b.vx = Math.cos(ang) * speed * -Math.sign(b.vx);
        b.vy = Math.sin(ang) * speed;
        // novo erro de mira pro adversário (às vezes grande o bastante pra falhar)
        const other = p === pong.left ? pong.right : pong.left;
        other.err = (Math.random() - 0.5) * pong.paddle * 1.6;
        b.x = px;
        return true;
      };
      if (b.vx < 0 && b.x <= 2) hit(pong.left, 2);
      if (b.vx > 0 && b.x >= pong.cols - 3) hit(pong.right, pong.cols - 3);

      // gol
      if (b.x < -1) { pong.score[1]++; serve(1); }
      if (b.x > pong.cols) { pong.score[0]++; serve(-1); }
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pong.cols = Math.ceil(width / cell);
      pong.rows = Math.ceil(height / cell);
      pong.left.y = pong.right.y = pong.rows / 2 - pong.paddle / 2;
      serve(Math.random() < 0.5 ? 1 : -1);
    };

    const draw = () => {
      const dark = isDark();
      ctx.clearRect(0, 0, width, height);

      // suaviza o movimento do spotlight
      mouse.x += (mouse.tx - mouse.x) * 0.15;
      mouse.y += (mouse.ty - mouse.y) * 0.15;

      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      const base = dark ? "255,255,255" : "17,17,17";
      const accent = dark ? "248,113,113" : "220,38,38";

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * cell;
          const y = j * cell;
          const d = Math.hypot(x + cell / 2 - mouse.x, y + cell / 2 - mouse.y);
          let a = dark ? 0.035 : 0.05;
          let color = base;
          if (d < radius) {
            const t = 1 - d / radius;
            a = 0.05 + t * t * 0.55;
            color = t > 0.6 ? accent : base;
          }
          ctx.fillStyle = `rgba(${color},${a})`;
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        }
      }

      // ---- Pong ----
      if (!reduced) stepPong();
      const px = (v) => Math.round(v) * cell + 1;
      const fillCell = (i, j, color, a) => {
        ctx.fillStyle = `rgba(${color},${a})`;
        ctx.fillRect(px(i), px(j), cell - 2, cell - 2);
      };
      // linha central tracejada
      for (let j = 0; j < pong.rows; j += 2) fillCell(pong.cols / 2, j, base, 0.12);
      // goleiros
      for (let k = 0; k < pong.paddle; k++) {
        fillCell(1, pong.left.y + k, base, 0.55);
        fillCell(pong.cols - 2, pong.right.y + k, base, 0.55);
      }
      // bola
      fillCell(pong.ball.x, pong.ball.y, accent, 0.9);
      // placar
      ctx.fillStyle = `rgba(${base},0.18)`;
      ctx.font = `${cell * 1.6}px var(--font-press-start-2p), monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(`${pong.score[0]}   ${pong.score[1]}`, width / 2, cell * 1.5);

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      if (reduced) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
        draw();
      }
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    const observer = new MutationObserver(() => reduced && draw());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      observer.disconnect();
    };
  }, [cell, radius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
