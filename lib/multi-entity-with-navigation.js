// multi-entity-with-navigation.js
// Versão 0.6 - Filtros declarados + Estilo dashboard + Exportação/Importação + CRUD

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
  const filtrosHTMLRel = filtrosRelacionados.map(rel => {
    return `<label>Filtrar por ${rel.de}:
      <select onchange="filtrarPor('${entidadeRef}', '${rel.via}', this.value)">
        <option value="">Todos</option>
      </select>
    </label>`;
  }).join('<br/>');

  const filtrosDeclarados = (tela.filtros || []).map(campo => {
    return `<label>Filtrar por ${campo}:
      <input type="text" oninput="filtrarPor('${entidadeRef}', '${campo}', this.value)">
    </label>`;
  }).join('<br/>');

  return `
<section id="${tela.tela.replace(/\s+/g, '-').toLowerCase()}" style="display:none">
  <h2>${tela.tela}</h2>
  ${filtrosDeclarados}<br/>${filtrosHTMLRel}<br/>
  <form onsubmit="handleAdd(event, '${entidadeRef}')">
    ${inputs}<br/><button type="submit">Adicionar</button>
  </form>
  <button onclick="exportar('${entidadeRef}')">Exportar</button>
  <input type="file" accept=".json" onchange="importar('${entidadeRef}', event)">
  <table border="1" id="lista-${entidadeRef}" style="margin-top:1rem;"></table>
</section>`;
}

function generateApp(app, entidades, interfaces, relacionamentos) {
  const nav = interfaces.map(i => `<button onclick="show('${i.tela.replace(/\s+/g, '-').toLowerCase()}')">${i.tela}</button>`).join(' ');
  const screens = interfaces.map(i => generateScreen(i)).join('\n');
  const nomes = entidades.map(e => e.nome);

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${app.nome}</title>
<style>body{font-family:sans-serif;padding:1rem}input,select{margin:4px}button{margin-right:6px}table{width:100%;border-collapse:collapse}td,th{padding:4px}</style></head>
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
  const tabela = document.getElementById('lista-' + tipo);
  tabela.innerHTML = '';
  if (!dados[tipo].length) return;

  const header = '<tr>' + Object.keys(dados[tipo][0]).map(k => `<th>${k}</th>`).join('') + '<th>Ações</th></tr>';
  const linhas = dados[tipo].map((item, i) => {
    const campoFiltro = filtros[tipo]?.chave;
    const valorFiltro = filtros[tipo]?.valor;
    if (campoFiltro && valorFiltro && !String(item[campoFiltro]).includes(valorFiltro)) return '';

    const cells = Object.values(item).map(v => `<td>${v}</td>`).join('');
    let linha = `<tr>${cells}<td>
      <button onclick=\"editar('${tipo}', ${i})\">Editar</button>
      <button onclick=\"excluir('${tipo}', ${i})\">Excluir</button>
    </td></tr>`;

    ${relacionamentos.map(rel => `
    if (tipo === '${rel.de}') {
      linha = linha.replace('<tr>', '<tr onclick=\"navegarEncadeado(\\'${rel.para}\\', \\'${rel.via}\\', \\' + item.id + '\\')\" style=\"cursor:pointer\">');
    }`).join(' else ')}

    return linha;
  }).join('');

  tabela.innerHTML = header + linhas;
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

function exportar(tipo) {
  const blob = new Blob([JSON.stringify(dados[tipo], null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = tipo + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importar(tipo, event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      dados[tipo] = JSON.parse(e.target.result);
      render(tipo);
      salvarDados();
    } catch (err) {
      alert('Erro ao importar arquivo JSON.');
    }
  };
  reader.readAsText(file);
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
console.log('✅ App com filtros declarados, dashboard e export/import gerado em ./dist/index.html');
