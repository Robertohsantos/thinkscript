// multi-entity-with-relations.js
// Versão 0.3.1 - Suporte a relacionamentos entre entidades + filtros dinâmicos

import fs from 'fs';
import { parseThinkScript } from './lib/thinkscript-parser.js';
import yaml from 'js-yaml';

const source = fs.readFileSync('./examples/clientes-produtos.think', 'utf8');
const parsed = parseThinkScript(source);

const entidades = Array.isArray(parsed.entidade) ? parsed.entidade : [parsed.entidade];
const entidadeMap = Object.fromEntries(entidades.map(e => [e.nome, e]));
const relacionamentos = parsed.relacionamentos || [];

function generateScreen(tela) {
  const entidadeRef = tela.mostra?.replace('[]', '') || '';
  const entidade = entidadeMap[entidadeRef];
  if (!entidade) return `<section><h2>${tela.tela}</h2><p>Entidade não encontrada</p></section>`;

  const campos = entidade.campos.map(c => Object.keys(c)[0]);
  const inputs = campos.map(c => `<label>${c}: <input name="${c}" type="text"></label>`).join('<br/>');

  const filtrosRelacionados = relacionamentos.filter(r => r.para === entidadeRef);
  const filtrosHTML = filtrosRelacionados.map(rel => {
    return `<label>Filtrar por ${rel.de}:
      <select onchange="filtrarPor('${entidadeRef}', '${rel.via}', this.value)">
        <option value="">Todos</option>
      </select>
    </label>`;
  }).join('<br/>');

  return `
<section id="${tela.tela.replace(/\s+/g, '-').toLowerCase()}" style="display:none">
  <h2>${tela.tela}</h2>
  ${filtrosHTML}
  <form onsubmit="handleAdd(event, '${entidadeRef}')">
    ${inputs}<br/><button type="submit">Adicionar</button>
  </form>
  <ul id="lista-${entidadeRef}"></ul>
</section>`;
}

function generateApp(app, entidades, interfaces, relacionamentos) {
  const nav = interfaces.map(i => `<button onclick="show('${i.tela.replace(/\s+/g, '-').toLowerCase()}')">${i.tela}</button>`).join(' ');
  const screens = interfaces.map(i => generateScreen(i)).join('\n');
  const nomes = entidades.map(e => e.nome);

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${app.nome}</title>
<style>body{font-family:sans-serif;padding:1rem}input,select{margin:4px}button{margin-right:6px}</style></head>
<body>
<h1>${app.nome}</h1>
<nav>${nav}</nav>
${screens}
<script>
let dados = { ${nomes.map(n => `${n}: []`).join(', ')} };
let filtros = {};

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
    const campoFiltro = filtros[tipo]?.chave;
    const valorFiltro = filtros[tipo]?.valor;
    if (campoFiltro && valorFiltro && item[campoFiltro] !== valorFiltro) return;
    const li = document.createElement('li');
    li.textContent = Object.values(item).join(' | ');
    ul.appendChild(li);
  });
}

function filtrarPor(tipo, chave, valor) {
  filtros[tipo] = { chave, valor };
  render(tipo);
}

function show(id) {
  document.querySelectorAll('section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  const tipo = id.replace(/-/g, '_');
  render(tipo);
}
show('${parsed.interface[0].tela.replace(/\s+/g, '-').toLowerCase()}');
</script>
</body></html>`;
}

const html = generateApp(parsed.app, entidades, parsed.interface, relacionamentos);
fs.mkdirSync('./dist', { recursive: true });
fs.writeFileSync('./dist/index.html', html);
console.log('✅ App com relacionamentos gerado em ./dist/index.html');
