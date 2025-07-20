// multi-screen-generator.js
// Versão 0.2 - Suporte a múltiplas entidades e telas

import fs from 'fs';
import { parseThinkScript } from './lib/thinkscript-parser.js';
import yaml from 'js-yaml';

const source = fs.readFileSync('./examples/tarefas.think', 'utf8');
const parsed = parseThinkScript(source);

function generateScreen(tela, entidade) {
  const campos = entidade.campos.map(c => Object.keys(c)[0]);
  const inputs = campos.map(c => `<label>${c}: <input name="${c}" type="text"></label>`).join('<br/>');

  return `
<section id="${tela.tela.replace(/\s+/g, '-').toLowerCase()}" style="display:none">
  <h2>${tela.tela}</h2>
  ${tela.mostra ? `
  <form onsubmit="handleAdd(event, '${entidade.nome}')">
    ${inputs}<br/><button type="submit">Adicionar</button>
  </form>
  <ul id="lista-${entidade.nome}"></ul>
  ` : ''}
</section>`;
}

function generateApp(app, entidade, interfaces) {
  const nav = interfaces.map(i => `<button onclick="show('${i.tela.replace(/\s+/g, '-').toLowerCase()}')">${i.tela}</button>`).join(' ');
  const screens = interfaces.map(i => generateScreen(i, entidade)).join('\n');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${app.nome}</title>
<style>
body{font-family:sans-serif;padding:1rem}section{margin-top:1rem}input{margin:4px}button{margin-right:6px}
</style></head><body>
<h1>${app.nome}</h1>
<nav>${nav}</nav>
${screens}
<script>
let dados = { ${entidade.nome}: [] };
function handleAdd(e, tipo) {
  e.preventDefault();
  const form = e.target;
  const nova = Object.fromEntries(new FormData(form));
  dados[tipo].push(nova);
  form.reset();
  render(tipo);
}
function render(tipo) {
  const ul = document.getElementById('lista-' + tipo);
  ul.innerHTML = '';
  dados[tipo].forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = Object.values(item).join(' | ');
    ul.appendChild(li);
  });
}
function show(id) {
  document.querySelectorAll('section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
show('${interfaces[0].tela.replace(/\s+/g, '-').toLowerCase()}');
</script>
</body></html>`;
}

const html = generateApp(parsed.app, parsed.entidade, parsed.interface);
fs.mkdirSync('./dist', { recursive: true });
fs.writeFileSync('./dist/index.html', html);
console.log('App gerado com sucesso com suporte a múltiplas telas. Veja em ./dist/index.html');
