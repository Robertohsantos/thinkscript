// thinkscript-parser.js
// Versão 0.1 - Parser básico para ThinkScript

import yaml from 'js-yaml';

/**
 * Lê um arquivo ThinkScript (.think) e retorna um objeto JSON estruturado.
 * @param {string} source - Conteúdo do arquivo .think
 * @returns {object} - Estrutura JSON equivalente
 */
export function parseThinkScript(source) {
  try {
    const parsed = yaml.load(source);

    // Valida estrutura básica obrigatória
    if (!parsed.app || !parsed.entidade || !parsed.interface) {
      throw new Error('Estrutura inválida: é necessário ter blocos app, entidade e interface.');
    }

    return {
      app: parsed.app,
      entidade: parsed.entidade,
      interface: parsed.interface,
      raw: parsed, // caso queira acessar blocos adicionais
    };
  } catch (e) {
    console.error('Erro ao interpretar ThinkScript:', e.message);
    throw e;
  }
}
