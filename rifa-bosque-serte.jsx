import { useState, useEffect, useRef } from "react";
import { fetchEntriesFromSupabase, saveEntriesToSupabase, saveDrawToSupabase } from "./src/config/supabase";

const TOTAL = 100;

function useWindowWidth() {
  const [w, setW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 900));
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function ResponsiveStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      
      /* Desktop - 1024px+ */
      .rifa-grid { 
        display: grid; 
        gap: clamp(4px, 1vw, 8px); 
        margin: 0 0 28px; 
        grid-template-columns: repeat(10, 1fr); 
      }
      
      .prize-card { 
        display: flex; 
        flex-direction: row; 
        align-items: stretch;
        gap: clamp(12px, 3vw, 20px);
        overflow: hidden;
      }
      
      .prize-img-wrap { 
        flex-shrink: 0;
        min-width: clamp(120px, 25vw, 170px); 
        max-width: clamp(120px, 25vw, 170px);
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .progress-label { 
        display: flex; 
        justify-content: space-between; 
        align-items: center;
        flex-wrap: wrap;
        gap: clamp(8px, 2vw, 16px);
      }

      /* Tablet - 768px a 1023px */
      @media (max-width: 1023px) {
        .rifa-grid { grid-template-columns: repeat(8, 1fr); gap: clamp(4px, 0.8vw, 6px); }
      }

      /* Tablet pequeno/Mobile grande - 481px a 767px */
      @media (max-width: 767px) {
        .rifa-grid { 
          grid-template-columns: repeat(6, 1fr); 
          gap: clamp(3px, 0.7vw, 5px); 
          margin: 0 0 20px;
        }
        
        .prize-card { 
          flex-direction: column;
          gap: 0;
        }
        
        .prize-img-wrap { 
          min-width: 100%; 
          max-width: 100%; 
          width: 100%; 
          min-height: 180px;
          padding: 12px 16px !important;
        }
        
        .progress-label { 
          flex-direction: column; 
          align-items: flex-start; 
          gap: 8px;
        }
      }

      /* Mobile médio - 361px a 480px */
      @media (max-width: 480px) {
        .rifa-grid { 
          grid-template-columns: repeat(5, 1fr); 
          gap: clamp(3px, 0.5vw, 4px); 
          margin: 0 0 16px;
        }
      }

      /* Mobile pequeno - até 360px */
      @media (max-width: 360px) {
        .rifa-grid { 
          grid-template-columns: repeat(4, 1fr); 
          gap: 3px; 
          margin: 0 0 12px;
        }
      }

      /* Regras gerais de responsividade */
      .rifa-grid button {
        aspect-ratio: 1;
        min-height: clamp(28px, 8vw, 50px);
      }

      @media (max-width: 640px) {
        body { margin: 0; padding: 0; }
      }
    `}</style>
  );
}

const COLORS = {
  bg: "#fdf8f0",
  card: "#ffffff",
  green: "#2d6a4f",
  greenLight: "#52b788",
  greenPale: "#d8f3dc",
  amber: "#b5600a",
  amberLight: "#f4a261",
  amberPale: "#fff3e0",
  text: "#1b3a2d",
  muted: "#6b8a76",
  border: "#cde8d4",
  sold: "#e8a0a0",
  soldText: "#7a1f1f",
  free: "#d8f3dc",
  freeHover: "#52b788",
};

const styles = {
  root: {
    fontFamily: "'Georgia', serif",
    background: COLORS.bg,
    minHeight: "100vh",
    padding: "0 0 60px",
  },
  header: {
    background: `linear-gradient(160deg, #1b3a2d 0%, #2d6a4f 60%, #52b788 100%)`,
    color: "#fff",
    padding: "clamp(16px, 4vw, 36px) clamp(12px, 3vw, 24px) clamp(14px, 3vw, 28px)",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  headerLeaf: {
    position: "absolute",
    opacity: 0.07,
    fontSize: 220,
    top: -40,
    right: -20,
    pointerEvents: "none",
    lineHeight: 1,
  },
  badge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.18)",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 20,
    padding: "clamp(3px, 1vw, 4px) clamp(10px, 2vw, 16px)",
    fontSize: "clamp(10px, 2vw, 12px)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "clamp(8px, 2vw, 12px)",
  },
  title: {
    fontSize: "clamp(20px, 5.5vw, 32px)",
    fontWeight: "bold",
    margin: "0 0 clamp(4px, 1vw, 6px)",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "clamp(12px, 3vw, 15px)",
    opacity: 0.85,
    maxWidth: 520,
    margin: "0 auto clamp(12px, 2vw, 16px)",
    lineHeight: 1.6,
  },
  missionBox: {
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 12,
    maxWidth: 600,
    margin: "0 auto",
    padding: "clamp(12px, 3vw, 14px) clamp(12px, 3.5vw, 20px)",
    fontSize: "clamp(12px, 2.8vw, 13.5px)",
    lineHeight: 1.7,
    textAlign: "left",
  },
  main: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "0 clamp(8px, 2.5vw, 16px)",
  },
  progressSection: {
    margin: "clamp(16px, 3vw, 24px) 0 clamp(8px, 2vw, 8px)",
    background: COLORS.card,
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    padding: "clamp(12px, 2.5vw, 18px) clamp(12px, 3.5vw, 22px)",
  },
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "clamp(8px, 2vw, 10px)",
    flexWrap: "wrap",
    gap: "clamp(8px, 2vw, 12px)",
  },
  progressBarBg: {
    background: COLORS.greenPale,
    borderRadius: 8,
    height: "clamp(10px, 2.5vw, 14px)",
    overflow: "hidden",
    minHeight: 10,
  },
  progressBarFill: (pct) => ({
    background: `linear-gradient(90deg, ${COLORS.green} 0%, ${COLORS.greenLight} 100%)`,
    height: "100%",
    width: `${pct}%`,
    borderRadius: 8,
    transition: "width 0.5s ease",
  }),
  legend: {
    display: "flex",
    gap: "clamp(12px, 3vw, 20px)",
    justifyContent: "flex-end",
    margin: "clamp(8px, 2vw, 10px) 0 clamp(12px, 2vw, 16px)",
    fontSize: "clamp(12px, 2.5vw, 13px)",
    color: COLORS.muted,
    flexWrap: "wrap",
  },
  legendDot: (color) => ({
    width: 14,
    height: 14,
    borderRadius: 4,
    background: color,
    border: `1px solid ${COLORS.border}`,
    display: "inline-block",
    verticalAlign: "middle",
    marginRight: 5,
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 1fr)",
    gap: 6,
    margin: "0 0 28px",
  },
  numBtn: (sold, hover) => ({
    aspectRatio: "1",
    borderRadius: 6,
    border: sold ? `1.5px solid #c97a7a` : `1.5px solid ${COLORS.greenLight}`,
    background: sold ? COLORS.sold : hover ? COLORS.freeHover : COLORS.free,
    color: sold ? COLORS.soldText : hover ? "#ffffff" : COLORS.green,
    fontFamily: "'Georgia', serif",
    fontSize: "clamp(9px, 2vw, 13px)",
    fontWeight: sold ? "bold" : "normal",
    opacity: sold ? 0.7 : 1,
    cursor: sold ? "default" : "pointer",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxShadow: sold ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
    padding: 0,
    minWidth: 0,
    minHeight: "clamp(28px, 7vw, 48px)",
  }),
  drawSection: {
    background: COLORS.amberPale,
    border: `2px solid ${COLORS.amberLight}`,
    borderRadius: 16,
    padding: "clamp(20px, 4vw, 28px) clamp(16px, 3vw, 24px)",
    textAlign: "center",
    margin: "0 0 clamp(16px, 3vw, 24px)",
  },
  drawBtn: {
    background: `linear-gradient(135deg, ${COLORS.amber} 0%, ${COLORS.amberLight} 100%)`,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "clamp(10px, 2.5vw, 16px) clamp(18px, 5vw, 44px)",
    fontSize: "clamp(13px, 3.5vw, 18px)",
    fontFamily: "'Georgia', serif",
    fontWeight: "bold",
    cursor: "pointer",
    letterSpacing: "0.03em",
    boxShadow: "0 4px 16px rgba(181,96,10,0.3)",
    transition: "transform 0.1s",
    width: "100%",
    maxWidth: 320,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(27,58,45,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "clamp(12px, 3vw, 20px)",
    overflowY: "auto",
  },
  modal: {
    background: COLORS.card,
    borderRadius: 18,
    padding: "clamp(18px, 4vw, 32px) clamp(14px, 4vw, 28px) clamp(18px, 3vw, 24px)",
    width: "100%",
    maxWidth: 380,
    boxShadow: "0 20px 60px rgba(27,58,45,0.25)",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalTitle: {
    fontSize: "clamp(18px, 4vw, 22px)",
    color: COLORS.green,
    fontWeight: "bold",
    margin: "0 0 4px",
  },
  modalSub: {
    color: COLORS.muted,
    fontSize: "clamp(12px, 3vw, 14px)",
    margin: "0 0 clamp(16px, 3vw, 22px)",
  },
  label: {
    display: "block",
    fontSize: "clamp(11px, 2.5vw, 13px)",
    color: COLORS.muted,
    marginBottom: 4,
    fontFamily: "Arial, sans-serif",
  },
  input: {
    width: "100%",
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "clamp(8px, 2vw, 10px) clamp(10px, 2.5vw, 13px)",
    fontSize: "clamp(13px, 2.5vw, 15px)",
    marginBottom: "clamp(12px, 2.5vw, 16px)",
    outline: "none",
    fontFamily: "Arial, sans-serif",
    background: "#f7fdf9",
    boxSizing: "border-box",
    color: COLORS.text,
  },
  saveBtn: {
    width: "100%",
    background: COLORS.green,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "clamp(10px, 2.5vw, 13px)",
    fontSize: "clamp(14px, 2.5vw, 16px)",
    fontFamily: "'Georgia', serif",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 4,
  },
  cancelBtn: {
    width: "100%",
    background: "transparent",
    color: COLORS.muted,
    border: "none",
    fontSize: "clamp(12px, 2.5vw, 14px)",
    fontFamily: "Arial, sans-serif",
    cursor: "pointer",
    marginTop: "clamp(8px, 2vw, 10px)",
    padding: "6px",
  },
  infoCard: {
    background: COLORS.card,
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    padding: "clamp(12px, 3vw, 18px) clamp(12px, 3vw, 18px)",
    fontSize: "clamp(12px, 2.5vw, 13.5px)",
    color: COLORS.text,
    lineHeight: 1.6,
  },
  winnerModal: {
    background: COLORS.card,
    borderRadius: 20,
    padding: "clamp(20px, 5vw, 40px) clamp(14px, 4vw, 32px) clamp(18px, 4vw, 28px)",
    width: "100%",
    maxWidth: 400,
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(27,58,45,0.3)",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  },
};

function Confetti({ active }) {
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
      color: ["#52b788","#2d6a4f","#f4a261","#b5600a","#d8f3dc","#fff3e0"][Math.floor(Math.random()*6)],
      vx: (Math.random()-0.5)*3,
      vy: Math.random()*3+1.5,
      rot: Math.random()*360,
      vr: (Math.random()-0.5)*4,
    }));
    let frame;
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",borderRadius:20}} />;
}

function NumberCell({ num, data, onClick }) {
  const [hover, setHover] = useState(false);
  const sold = !!data;
  return (
    <button
      style={styles.numBtn(sold, hover)}
      onClick={() => !sold && onClick(num)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={sold ? `Número ${num} — Reservado` : `Número ${num}`}
    >
      {num}
    </button>
  );
}

export default function RifaBosqueSerte() {
  const w = useWindowWidth();
  const isMobile = w < 480;
  const [entries, setEntries] = useState({});
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nome: "", sobrenome: "", telefone: "" });
  const [winner, setWinner] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassModal, setShowPassModal] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const entriesFromDb = await fetchEntriesFromSupabase();
        if (entriesFromDb && Object.keys(entriesFromDb).length > 0) {
          setEntries(entriesFromDb);
        }
      } catch (error) {
        console.error("Erro ao carregar entradas do Supabase:", error);
        // Fallback para localStorage se Supabase falhar
        try {
          const result = await window.storage.get("rifa_entries");
          if (result && result.value) setEntries(JSON.parse(result.value));
        } catch {}
      }
      setLoaded(true);
    })();
  }, []);

  const save = async (updated) => {
    try {
      await saveEntriesToSupabase(updated);
      setEntries(updated);
    } catch (error) {
      console.error("Erro ao salvar entradas no Supabase:", error);
      // Fallback para localStorage se Supabase falhar
      try {
        await window.storage.set("rifa_entries", JSON.stringify(updated));
        setEntries(updated);
      } catch (localError) {
        console.error("Erro ao salvar em localStorage:", localError);
      }
    }
  };

  const sold = Object.keys(entries).length;
  const pct = Math.round((sold / TOTAL) * 100);
  const allSold = sold === TOTAL;

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Informe o nome";
    if (!form.sobrenome.trim()) e.sobrenome = "Informe o sobrenome";
    if (!form.telefone.trim()) e.telefone = "Informe o telefone";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const updated = { ...entries, [selected]: { ...form } };
    save(updated);
    setSelected(null);
    setForm({ nome: "", sobrenome: "", telefone: "" });
    setErrors({});
  };

  const handleDraw = () => {
    setDrawing(true);
    let count = 0;
    const nums = Object.keys(entries).map(Number);
    const interval = setInterval(() => {
      const rnd = nums[Math.floor(Math.random() * nums.length)];
      setWinner({ num: rnd, ...entries[rnd], animating: true });
      count++;
      if (count > 20) {
        clearInterval(interval);
        const final = nums[Math.floor(Math.random() * nums.length)];
        const winnerData = { num: final, ...entries[final], animating: false };
        setWinner(winnerData);
        setDrawing(false);
        // Salvar resultado do sorteio no Supabase
        (async () => {
          try {
            await saveDrawToSupabase(winnerData, final);
          } catch (error) {
            console.error("Erro ao salvar sorteio no Supabase:", error);
          }
        })();
      }
    }, 80);
  };

  const handlePassSubmit = () => {
    if (passInput === "3026") {
      setShowPassModal(false);
      setPassInput("");
      setPassError("");
      handleDraw();
    } else {
      setPassError("Senha incorreta. Tente novamente.");
      setPassInput("");
    }
  };

  if (!loaded) return (
    <div style={{ textAlign: "center", padding: 60, fontFamily: "Georgia, serif", color: COLORS.green }}>
      Carregando rifa...
    </div>
  );

  return (
    <div style={styles.root}>
      <ResponsiveStyles />
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeaf}>🌿</div>
        <div style={styles.badge}>💚 Rifa Solidária de Impacto Social 💚</div>
        <h1 style={styles.title}>Rifa Bosque da Serte</h1>
        <p style={styles.subtitle}>Ajude a Alimentar Quem Precisa</p>
        <div style={styles.missionBox}>
          <strong style={{ fontSize: 14 }}>🏡 Sobre a Serte</strong>
          <div style={{ marginTop: 10, marginBottom: 6, fontSize: 15, fontWeight: "bold", letterSpacing: "0.08em" }}>O que é a SERTE?</div>
          <p style={{ margin: "0", lineHeight: 1.75, fontSize: 13 }}>
            A SERTE é uma instituição filantrópica, assistencial e educacional fundada em 1956. Começou como um pequeno rancho de madeira e evoluiu para um complexo assistencial que hoje oferece acolhimento, cuidado e amor a quem mais precisa.
          </p>
          
          <div style={{ marginTop: 12, marginBottom: 6, fontSize: 14, fontWeight: "bold", color: COLORS.greenLight }}>
            🌱 O Bosque da Serte
          </div>
          <p style={{ margin: "0", lineHeight: 1.75, fontSize: 13 }}>
            Um projeto voluntário especial onde cultivamos <strong>legumes e verduras orgânicas</strong>. Toda a produção é destinada a alimentar os idosos e crianças que vivem na Serte, garantindo refeições nutritivas e saudáveis. É mais que um jardim — é um ato de amor que nutre corpos e almas.
          </p>
        </div>
      </div>

      <div style={styles.main}>
        {/* Prize Card */}
        <div className="prize-card" style={{
          background: COLORS.card,
          borderRadius: 16,
          border: `2px solid ${COLORS.amberLight}`,
          margin: "24px 0 0",
          overflow: "hidden",
        }}>
          <div className="prize-img-wrap" style={{
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 12px",
          }}>
            <img
              src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAKqArUDASIAAhEBAxEB/8QAHQABAAEFAQEBAAAAAAAAAAAAAAcBBAUGCAMCCf/EAF0QAAEDAwEEBQcFCQsJBwQCAwEAAgMEBREGBxIhMRNBUWFxCBQiMoGRsRVSocHRFiMzQlNicqKyFyQ0NUNjc4KSk+ElRWR0dYOUs8IYJjdEVITSJ1Vlo+LwhcPx/8QAGgEBAQEBAQEBAAAAAAAAAAAAAAECAwUEBv/EACYRAQEAAgECBQUBAQAAAAAAAAABAhEDBAUSEzFhkQYVIUFRFNH/2gAMAwEAAhEDEQA/AOykT2J7EFQiBEBCiFBRE9iexBUckREBUPNVQoKIE9iqEBERAKoqlU9iAiexPYgInsT2ICDmnsQIKoiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIKZTKIgqEQIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgoiqiAEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQUymURBUIgRAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERCcBARULgqoCIiAiIgIiICIiAiIgIiIKIiIKhECICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIDuRXPG3fbTrfSepJbPpHSxuMMcIkdWOYXNHzuXAY710O7kVAO3ygg0/bry22mRnn9tqaicueXemdwcOPDkOSCK6fb1tPvFjElFKRcAXdPDFRejDg8PSxjl3qOb9t9200kz9/UckDQeLXMaPqW8bFMjZBVOGcmWXJJ481BO00k1T+P8ofig2uh8orbJVVbKdmq5C5xwAWtGfoU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iIgIgVUFE4qqICIqHmgqioiCpKoiICIiAiIig5qqoOaqiCIiAiIgIiIGEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAKoqlUQMplEQMplEQMoiICIiAmURAREQEREBAiBBUqiqVRARECAiqiBhMIiBhUKqqFAymURAyiIgIiICIiAiIgIiIoFVERBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARFQoKlUREBERAREQEREBERAREQEREBERAQIiCpVERAQIiCqKiIKoqIgqqFEQEREBERAREQEREBERARERVUREQREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFQqqoUBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARERVUREQREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFQqqoUBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARERVUREQREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFQqqoUBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARERVUREQREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFQqqFBRFQck6wgqiqqFAREQEVF9IKIqqjkBERAREQEREBEQckBFRVQERCgIiICIiAiDkqIKoidSAiJ1ICIiAidaHmgIiICIiK//2Q=="
              alt="Multiprocessador Turbo Chef 9 em 1 Mondial"
              style={{ width: "100%", maxWidth: 150, objectFit: "contain", display: "block" }}
            />
          </div>
          <div style={{ padding: "20px 22px", flex: 1 }}>
            <div style={{
              display: "inline-block",
              background: COLORS.amberPale,
              color: COLORS.amber,
              border: `1px solid ${COLORS.amberLight}`,
              borderRadius: 20,
              padding: "3px 14px",
              fontSize: 11,
              fontFamily: "Arial, sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
              fontWeight: "bold",
            }}>
              🏆 Prêmio da Rifa
            </div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: "bold", color: COLORS.text, marginBottom: 4, lineHeight: 1.3 }}>
              Multiprocessador de Alimentos<br/>Turbo Chef 9 em 1
            </div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: COLORS.amber, fontWeight: "bold", marginBottom: 8 }}>
              Mondial • 1000W
            </div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12.5, color: COLORS.muted, lineHeight: 1.6 }}>
              Liquidificador • Processador • Espremedor de frutas • Fatiador • Ralador • Triturador e muito mais — tudo em um só aparelho para a sua cozinha.
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={styles.progressSection}>
          <div className="progress-label" style={{ marginBottom: 10 }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: COLORS.muted }}>
              Progresso da Rifa
            </span>
            <span style={{ fontFamily: "'Georgia', serif", fontWeight: "bold", color: COLORS.green, fontSize: 18 }}>
              {sold} / {TOTAL} números
            </span>
          </div>
          <div style={styles.progressBarBg}>
            <div style={styles.progressBarFill(pct)} />
          </div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: COLORS.muted, textAlign: "right", marginTop: 6 }}>
            {pct}% vendido • {TOTAL - sold} disponíveis
          </div>
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          <span><span style={styles.legendDot(COLORS.free)} />Disponível</span>
          <span><span style={styles.legendDot(COLORS.sold)} />Reservado</span>
        </div>

        {/* Grid */}
        <div className="rifa-grid">
          {Array.from({ length: TOTAL }, (_, i) => i + 1).map(n => (
            <NumberCell
              key={n}
              num={n}
              data={entries[n]}
              onClick={setSelected}
            />
          ))}
        </div>

        {/* Draw section */}
        {allSold && (
          <div style={styles.drawSection}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: "bold", color: COLORS.amber, marginBottom: 8 }}>
              Todos os números foram vendidos!
            </div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: COLORS.muted, marginBottom: 20 }}>
              A rifa está completa. Hora de sortear o ganhador!
            </div>
            <button style={styles.drawBtn} onClick={() => { setPassInput(""); setPassError(""); setShowPassModal(true); }} disabled={drawing}>
              {drawing ? "Sorteando..." : "🌿 Realizar Sorteio"}
            </button>
          </div>
        )}

        {/* Info */}
        <div style={styles.infoCard}>
          <div style={{ marginBottom: 12 }}>
            <strong>🎯 Como Participar:</strong> Clique em um número disponível (1 a 100), preencha seu nome, sobrenome e telefone, e pronto! Seu número fica reservado na rifa.
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong>🏆 O Sorteio:</strong> Quando todos os 100 números forem vendidos, realizaremos um sorteio para escolher o ganhador do prêmio: um Multiprocessador Turbo Chef 9 em 1!
          </div>
          <div>
            <strong>💚 O Impacto:</strong> Toda a renda desta rifa vai direto para o <strong>Bosque da Serte</strong>, ajudando a manter a produção de alimentos que nutre 57 idosos, 10 crianças abrigadas e 240 crianças em programas educacionais. Seu apoio faz diferença real!
          </div>
        </div>

        {/* Impact Info */}
        <div style={{
          background: COLORS.greenPale,
          border: `2px solid ${COLORS.greenLight}`,
          borderRadius: 14,
          padding: "16px 18px",
          marginTop: 24,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>🌱 Cada Rifa Muda Vidas 🌱</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13.5, color: COLORS.text, lineHeight: 1.6 }}>
            Ao participar desta rifa, você está contribuindo para que o <strong>Bosque da Serte</strong> continue plantando legumes e verduras que alimentam nossos idosos e crianças todos os dias. A Serte não cobra nada — existe <strong>apenas pela generosidade de pessoas como você</strong>.
          </div>
        </div>

        {/* Manual Draw Button */}
        {sold > 0 && !allSold && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={() => { setPassInput(""); setPassError(""); setShowPassModal(true); }}
              disabled={drawing}
              style={{
                background: "transparent",
                border: `2px solid ${COLORS.green}`,
                color: COLORS.green,
                borderRadius: 12,
                padding: "12px 32px",
                fontSize: "clamp(14px, 3.5vw, 16px)",
                fontFamily: "'Georgia', serif",
                fontWeight: "bold",
                cursor: "pointer",
                letterSpacing: "0.03em",
                transition: "all 0.15s",
              }}
            >
              🎲 Realizar Sorteio Antecipado
            </button>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
              Necessário senha de autorização
            </div>
          </div>
        )}

      </div>

      {/* Password Modal */}
      {showPassModal && (
        <div style={styles.overlay} onClick={() => setShowPassModal(false)}>
          <div style={{ ...styles.modal, maxWidth: 340 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>🔒</div>
            <h2 style={{ ...styles.modalTitle, textAlign: "center" }}>Autorização</h2>
            <p style={{ ...styles.modalSub, textAlign: "center" }}>
              Digite a senha de 4 dígitos para realizar o sorteio antecipado
            </p>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              style={{
                ...styles.input,
                textAlign: "center",
                fontSize: 28,
                letterSpacing: "0.5em",
                borderColor: passError ? "#e24b4a" : COLORS.border,
              }}
              value={passInput}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                setPassInput(v);
                setPassError("");
              }}
              onKeyDown={e => e.key === "Enter" && passInput.length === 4 && handlePassSubmit()}
              placeholder="••••"
              autoFocus
            />
            {passError && (
              <div style={{ color: "#e24b4a", fontSize: 13, fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: -10, marginBottom: 14 }}>
                {passError}
              </div>
            )}

            <button
              style={{ ...styles.saveBtn, background: passInput.length === 4 ? COLORS.green : COLORS.muted, marginTop: 8 }}
              onClick={handlePassSubmit}
              disabled={passInput.length !== 4}
            >
              Confirmar e Sortear
            </button>
            <button style={styles.cancelBtn} onClick={() => { setShowPassModal(false); setPassError(""); setPassInput(""); }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Buy Modal */}
      {selected !== null && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>🌿</div>
            <h2 style={styles.modalTitle}>Número {selected}</h2>
            <p style={styles.modalSub}>Preencha seus dados para reservar este número</p>

            <label style={styles.label}>Nome *</label>
            <input
              style={{ ...styles.input, borderColor: errors.nome ? "#e24b4a" : COLORS.border }}
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              placeholder="Seu nome"
            />
            {errors.nome && <div style={{ color: "#e24b4a", fontSize: 12, marginTop: -12, marginBottom: 10, fontFamily: "Arial, sans-serif" }}>{errors.nome}</div>}

            <label style={styles.label}>Sobrenome *</label>
            <input
              style={{ ...styles.input, borderColor: errors.sobrenome ? "#e24b4a" : COLORS.border }}
              value={form.sobrenome}
              onChange={e => setForm(f => ({ ...f, sobrenome: e.target.value }))}
              placeholder="Seu sobrenome"
            />
            {errors.sobrenome && <div style={{ color: "#e24b4a", fontSize: 12, marginTop: -12, marginBottom: 10, fontFamily: "Arial, sans-serif" }}>{errors.sobrenome}</div>}

            <label style={styles.label}>Telefone *</label>
            <input
              style={{ ...styles.input, borderColor: errors.telefone ? "#e24b4a" : COLORS.border }}
              value={form.telefone}
              onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
              placeholder="(48) 99999-9999"
              type="tel"
            />
            {errors.telefone && <div style={{ color: "#e24b4a", fontSize: 12, marginTop: -12, marginBottom: 10, fontFamily: "Arial, sans-serif" }}>{errors.telefone}</div>}

            <button style={styles.saveBtn} onClick={handleSave}>
              Reservar Número {selected}
            </button>
            <button style={styles.cancelBtn} onClick={() => { setSelected(null); setErrors({}); }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Winner Modal */}
      {winner && (
        <div style={styles.overlay} onClick={() => setWinner(null)}>
          <div style={styles.winnerModal} onClick={e => e.stopPropagation()}>
            <Confetti active={!winner.animating} />
            <div style={{ fontSize: 56, marginBottom: 4 }}>🏆</div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: COLORS.muted, marginBottom: 4 }}>
              Número sorteado
            </div>
            <div style={{
              fontSize: "clamp(52px, 15vw, 72px)",
              fontWeight: "bold",
              color: winner.animating ? COLORS.greenLight : COLORS.green,
              fontFamily: "'Georgia', serif",
              lineHeight: 1,
              marginBottom: 16,
              transition: "color 0.1s",
            }}>
              {winner.num}
            </div>
            {!winner.animating && (
              <>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: "bold", color: COLORS.text, marginBottom: 4 }}>
                  🎉 {winner.nome} {winner.sobrenome}
                </div>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: COLORS.muted, marginBottom: 24 }}>
                  {winner.telefone}
                </div>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: COLORS.green, background: COLORS.greenPale, borderRadius: 10, padding: "10px 16px", marginBottom: 20 }}>
                  Parabéns! Obrigado por apoiar o Bosque da Serte. 🌱
                </div>
                <button
                  style={{ ...styles.saveBtn, marginTop: 0 }}
                  onClick={() => setWinner(null)}
                >
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
