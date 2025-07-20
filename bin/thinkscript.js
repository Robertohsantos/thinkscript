#!/usr/bin/env node

// bin/thinkscript.js
// CLI oficial do ThinkScript - Versão 0.1

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { parseThinkScript } from '../lib/thinkscript-parser.js';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const command = args[0];
const inputFile = args[1] || './examples/tarefas.think';
const outputFile = args[2] || './dist/index.html';

function help() {
  console.log(`\n🧠 ThinkScript CLI

Comandos disponíveis:
  thinkscript build <entrada.think> <saida.html>
  thinkscript validate <entrada.think>
  thinkscript help

Exemplos:
  thinkscript build examples/tarefas.think dist/index.html
  thinkscript validate examples/tarefas.think
`);
}

function validate(file) {
  const source = fs.readFileSync(file, 'utf8');
  const parsed = parseThinkScript(source);
  console.log('✅ Arquivo válido:', file);
  console.log('  App:', parsed.app?.nome);
  console.log('  Entidades:', Array.isArray(parsed.entidade) ? parsed.entidade.length : 1);
  console.log('  Telas:', parsed.interface?.length || 0);
}

function build(file, output) {
  const source = fs.readFileSync(file, 'utf8');
  const parsed = parseThinkScript(source);

  const entidades = Array.isArray(parsed.entidade) ? parsed.entidade : [parsed.entidade];
  const entidadeMap = Object.fromEntries(entidades.map(e => [e.nome, e]));

  const html = generateApp(parsed.app, entidades, parsed.interface, entidadeMap);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
  console.log('✅ App gerado com sucesso:', output);
}

function generateApp(app, entidades, interfaces, entidadeMap) {
  const nav = interfaces.map(i => `<button onclick=\"show('${i.tela.replace(/\s+/g, '-')}')\">${i.tela}</button>`).join(' ');
  const screens = interfaces.map(tela => {
    const entidade = entidadeMap[tela.mostra?.replace('[]', '')];
    if (!entidade) return `<section><h2>${tela.tela}</h2><p>Entidade não encontrada.</p></section>`;
    const campos = entidade.campos.map(c => Object.keys(c)[0]);
    const inputs = campos.map(c => `<label>${c}: <input name=\"${c}\" type=\"text\" /></label>`).join('<br/>');
    return `
<section id=\"${tela.tela.replace(/\s+/g, '-')}\" style=\"display:none\">
  <h2>${tela.tela}</h2>
  <form onsubmit=\"handleAdd(event, '${entidade.nome}')\">
    ${inputs}<br/><button type=\"submit\">Adicionar</button>
  </form>
  <ul id=\"lista-${entidade.nome}\"></ul>
</section>`;
  }).join('\n');

  const nomes = entidades.map(e => e.nome);
  return `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>${app.nome}</title>
<style>body{font-family:sans-serif;padding:1rem}input{margin:4px}button{margin:4px}</style></head>
<body>
<h1>${app.nome}</h1>
<nav>${nav}</nav>
${screens}
<script>
let dados = { ${nomes.map(n => `${n}: []`).join(', ')} };
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
  dados[tipo].forEach(obj => {
    const li = document.createElement('li');
    li.textContent = Object.values(obj).join(' | ');
    ul.appendChild(li);
  });
}
function show(id) {
  document.querySelectorAll('section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
show('${interfaces[0].tela.replace(/\s+/g, '-')}');
</script>
</body></html>`;
}

switch (command) {
  case 'build':
    build(inputFile, outputFile);
    break;
  case 'validate':
    validate(inputFile);
    break;
  default:
    help();
    break;
}
