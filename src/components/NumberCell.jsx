import { useState } from "react";
import { styles } from "../styles/styles";

/**
 * Componente que renderiza uma célula numérica da rifa
 * @param {number} num - Número da célula
 * @param {object} data - Dados do comprador (nome, sobrenome, telefone)
 * @param {function} onClick - Callback quando o número é clicado
 */
export function NumberCell({ num, data, onClick }) {
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
