// multi-entity-with-navigation.js
// Versão 0.5 - CRUD completo + Relacionamentos + Navegação encadeada + Persistência

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
let editando = null;

function handleAdd(e, tipo) {
  e.preventDefault();
  const form = e.target;
  const nova = Object.fromEntries(new FormData(form));
  if (editando !== null) {
    dados[tipo][editando] = nova;
    editando = null;
    form.querySelector('button[type="submit"]').textContent = 'Adicionar';
  } else {
    dados[tipo].push(nova);
  }
  form.reset();
  render(tipo);
  salvarDados();
}

function render(tipo) {
  const ul = document.getElementById('lista-' + tipo);
  ul.innerHTML = '';
  dados[tipo].forEach((item, i) => {
    const campoFiltro = filtros[tipo]?.chave;
    const valorFiltro = filtros[tipo]?.valor;
    if (campoFiltro && valorFiltro && item[campoFiltro] !== valorFiltro) return;

    const li = document.createElement('li');
    li.innerHTML = Object.values(item).join(' | ') +
      ` <button onclick="editar('${tipo}', ${i})">Editar</button>` +
      ` <button onclick="excluir('${tipo}', ${i})">Excluir</button>`;

    ${relacionamentos.map(rel => `
    if (tipo === '${rel.de}') {
      li.onclick = (e) => {
        if (!e.target.matches('button')) navegarEncadeado('${rel.para}', '${rel.via}', item['id']);
      };
      li.style.cursor = 'pointer';
    }`).join(' else ')}

    ul.appendChild(li);
  });
}

function editar(tipo, index) {
  const form = document.querySelector(`form[onsubmit*="${tipo}"]`);
  const item = dados[tipo][index];
  Object.keys(item).forEach(k => {
    const input = form.querySelector(`[name="${k}"]`);
    if (input) input.value = item[k];
  });
  editando = index;
  form.querySelector('button[type="submit"]').textContent = 'Salvar';
}

function excluir(tipo, index) {
  if (confirm('Deseja realmente excluir este item?')) {
    dados[tipo].splice(index, 1);
    render(tipo);
    salvarDados();
  }
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

function navegarEncadeado(telaDestino, campo, valor) {
  filtros[telaDestino] = { chave: campo, valor };
  show(telaDestino.replace(/_/g, '-'));
}

function salvarDados() {
  localStorage.setItem('dadosApp', JSON.stringify(dados));
}

function carregarDados() {
  const salvo = localStorage.getItem('dadosApp');
  if (salvo) dados = JSON.parse(salvo);
}

carregarDados();
show('${parsed.interface[0].tela.replace(/\s+/g, '-').toLowerCase()}');
</script>
</body></html>`;
}

const html = generateApp(parsed.app, entidades, parsed.interface, relacionamentos);
fs.mkdirSync('./dist', { recursive: true });
fs.writeFileSync('./dist/index.html', html);
console.log('✅ App com navegação encadeada + CRUD completo gerado em ./dist/index.html');
