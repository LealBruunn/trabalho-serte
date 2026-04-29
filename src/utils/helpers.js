/**
 * Valida os dados do formulário de compra
 * @param {object} form - Objeto com nome, sobrenome e telefone
 * @returns {object} Objeto com erros encontrados (vazio se válido)
 */
export function validateForm(form) {
  const errors = {};

  if (!form.nome.trim()) {
    errors.nome = "Informe o nome";
  }

  if (!form.sobrenome.trim()) {
    errors.sobrenome = "Informe o sobrenome";
  }

  if (!form.telefone.trim()) {
    errors.telefone = "Informe o telefone";
  }

  return errors;
}

/**
 * Verifica se a senha de sorteio está correta
 * @param {string} password - Senha inserida
 * @returns {boolean} True se a senha é correta
 */
export function verifyPassword(password) {
  return password === "3026";
}

/**
 * Realiza o sorteio entre os números vendidos
 * @param {object} entries - Objeto com os números e dados dos compradores
 * @returns {object} Objeto com número sorteado e dados do ganhador
 */
export function performDraw(entries) {
  const nums = Object.keys(entries).map(Number);

  if (nums.length === 0) {
    return null;
  }

  const finalNumber = nums[Math.floor(Math.random() * nums.length)];

  return {
    num: finalNumber,
    ...entries[finalNumber],
    animating: false,
  };
}
