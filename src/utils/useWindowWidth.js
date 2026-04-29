import { useState, useEffect } from "react";

/**
 * Hook customizado para detectar a largura da janela
 * @returns {number} Largura atual da janela
 */
export function useWindowWidth() {
  const [w, setW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 900
  );

  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return w;
}
