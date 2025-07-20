// generate-app.js
// Versão 0.1 - Gera HTML/JS com base no ThinkScript JSON

import fs from 'fs';
import { parseThinkScript } from './lib/thinkscript-parser.js';
import yaml from 'js-yaml';

// Caminho do arquivo .think
const pathToFile = './examples/tarefas.think';
const source = fs.readFileSync(pathToFile, 'utf-8');
const parsed = parseThinkScript(source);

// Gera HTML inicial com base na interface e entidade
function generateHTML(app, entidade, interfaces) {
  const campos = entidade.campos.map(c => Object.keys(c)[0]);
  const htmlFormInputs = campos.map(campo => `
    <label>${campo}:
      <input name="${campo}" type="text" />
    </label>
  `).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${app.nome}</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; }
    input, button { padding: 8px; margin: 4px 0; }
    .tarefa { margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #ccc; }
    .concluida { text-decoration: line-through; color: gray; }
  </style>
</head>
<body>
  <h1>${app.nome}</h1>
  <form id="nova-tarefa-form">
    ${htmlFormInputs}
    <button type="submit">Adicionar</button>
  </form>

  <h2>Tarefas</h2>
  <div id="lista-tarefas"></div>

  <script>
    const form = document.getElementById('nova-tarefa-form');
    const lista = document.getElementById('lista-tarefas');
    let tarefas = [];

    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const tarefa = {};
      data.forEach((v, k) => tarefa[k] = v);
      tarefa.status = 'pendente';
      tarefas.push(tarefa);
      form.reset();
      render();
    });

    function render() {
      lista.innerHTML = '';
      tarefas.forEach((t, i) => {
        const div = document.createElement('div');
        div.className = 'tarefa' + (t.status === 'concluída' ? ' concluida' : '');
        div.innerHTML = `
          <strong>${t.descricao || '(sem descricao)'}</strong><br/>
          ${t.categoria || ''} ${t.data_limite || ''}<br/>
          <button onclick="concluir(${i})">Concluir</button>
          <button onclick="excluir(${i})">Excluir</button>
        `;
        lista.appendChild(div);
      });
    }

    window.concluir = i => {
      tarefas[i].status = 'concluída';
      render();
    }

    window.excluir = i => {
      tarefas.splice(i, 1);
      render();
    }
  </script>
</body>
</html>`;
}

const html = generateHTML(parsed.app, parsed.entidade, parsed.interface);
fs.mkdirSync('./dist', { recursive: true });
fs.writeFileSync('./dist/index.html', html);
console.log('App gerado com sucesso em ./dist/index.html');
