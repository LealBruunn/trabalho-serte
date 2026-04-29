import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jvvfytuzrgesvuzbleqg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4_7OwroafFcgkB_OxgjmRg_8b82_fFA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Salva as entradas da rifa no Supabase
 * @param {object} entries - Objeto com os números e dados dos compradores
 * @returns {Promise}
 */
export async function saveEntriesToSupabase(entries) {
  try {
    const { data, error } = await supabase
      .from("rifa_entries")
      .upsert(
        Object.entries(entries).map(([numero, dados]) => ({
          numero: parseInt(numero),
          nome: dados.nome,
          sobrenome: dados.sobrenome,
          telefone: dados.telefone,
        })),
        { onConflict: "numero" }
      );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao salvar entradas:", error);
    throw error;
  }
}

/**
 * Recupera as entradas da rifa do Supabase
 * @returns {Promise<object>} Objeto com os números e dados dos compradores
 */
export async function fetchEntriesFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("rifa_entries")
      .select("*");

    if (error) throw error;

    // Converter array de volta para objeto com número como chave
    const entries = {};
    data.forEach((row) => {
      entries[row.numero] = {
        nome: row.nome,
        sobrenome: row.sobrenome,
        telefone: row.telefone,
      };
    });

    return entries;
  } catch (error) {
    console.error("Erro ao recuperar entradas:", error);
    return {};
  }
}

/**
 * Registra o sorteio realizado
 * @param {object} winner - Objeto com dados do ganhador
 * @param {number} winningNumber - Número sorteado
 * @returns {Promise}
 */
export async function saveDrawToSupabase(winner, winningNumber) {
  try {
    const { data, error } = await supabase
      .from("draws")
      .insert({
        numero_sorteado: winningNumber,
        nome_ganhador: `${winner.nome} ${winner.sobrenome}`,
        telefone_ganhador: winner.telefone,
        data_sorteio: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao registrar sorteio:", error);
    throw error;
  }
}
