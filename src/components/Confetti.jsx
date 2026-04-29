import { useEffect, useRef } from "react";

/**
 * Componente de confete animado para celebrar o sorteio
 * @param {boolean} active - Se o confete está ativo/animando
 */
export function Confetti({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 8 + 4,
      color: [
        "#52b788",
        "#2d6a4f",
        "#f4a261",
        "#b5600a",
        "#d8f3dc",
        "#fff3e0",
      ][Math.floor(Math.random() * 6)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 1.5,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 4,
    }));

    let frame;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
      });
      frame = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(frame);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        borderRadius: 20,
      }}
    />
  );
}
