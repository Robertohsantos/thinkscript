# ThinkScript

**ThinkScript** é uma linguagem de programação declarativa criada para descrever aplicações web de forma legível, modular e interpretável por inteligências artificiais (LLMs) ou motores de geração de interface.

> Crie aplicações completas descrevendo **o que você quer**, não como programar.

---

## 🔖 Exemplo de um app
```yaml
app:
  nome: "Lista de Tarefas"
  objetivo: "Gerenciar tarefas com categorias e datas"

entidade:
  nome: "tarefa"
  campos:
    - descricao: texto
    - categoria: ["Pessoal", "Trabalho"]
    - status: ["pendente", "concluída"]
    - data_limite: data

interface:
  - tela: "Lista de Tarefas"
    mostra: tarefa[]
    filtros:
      - categoria
      - status
    acoes:
      - adicionar nova tarefa
      - editar tarefa
      - excluir tarefa
      - marcar como concluída
    ordenacao:
      - por: data_limite
        ordem: crescente

  - tela: "Estatísticas"
    mostra:
      - total_tarefas
      - total_concluidas
      - grafico_tarefas_por_categoria
```

---

## 📊 Visão Geral
ThinkScript foi projetada para:
- Ser lida e gerada por humanos **ou IA**
- Servir como interface de entrada para **app builders assistidos por IA**
- Ser interpretada ou convertida em HTML/JS automaticamente

---

## 🚀 Recursos
- Declaração de entidades e campos (semelhança com bancos de dados)
- Geração de interfaces baseadas em tela
- Filtros, ordenação e ações padronizadas (CRUD)
- Múltiplas telas e múltiplas entidades em um único arquivo
- Relacionamentos entre entidades com filtros encadeados
- Navegação encadeada automática entre telas relacionadas (v0.4+)
- Persistência local com `localStorage` (v0.4+)
- Edição e exclusão de registros (CRUD completo, v0.5+)
- Filtros declarados por campo (v0.6)
- Visual aprimorado com tabelas (v0.6)
- Exportação e importação JSON de dados (v0.6)

---

## 🧪 Playground Local

Você pode testar a linguagem ThinkScript direto no seu navegador, sem IA, sem backend, com o arquivo:

```
playground/playground.html
```

### Como usar:
1. Abra o arquivo em um navegador moderno (ex: Chrome ou Edge)
2. Escreva ou cole um código `.think` na área à esquerda
3. Clique em “Gerar App”
4. Veja a aplicação renderizada ao vivo na área à direita

✔️ Nenhuma instalação é necessária. Roda 100% offline.

---

## 🧩 Interpretadores

### `lib/multi-entity-generator.js`
Suporte a múltiplas entidades e múltiplas telas declaradas.
```bash
node lib/multi-entity-generator.js
```

### `lib/multi-entity-with-relations.js`
Suporte ao bloco `relacionamentos`, com filtros dinâmicos entre entidades.
```bash
node lib/multi-entity-with-relations.js
```

### `lib/multi-entity-with-navigation.js` (v0.6)
Interpretador mais completo:
- Navegação entre entidades
- Filtros automáticos e declarados
- CRUD completo
- Exportação/Importação de dados
- Tabelas estilizadas

```bash
node lib/multi-entity-with-navigation.js
```

Resultado: app gerado em `./dist/index.html`

---

## 🛠️ Uso da CLI ThinkScript

A CLI oficial está localizada em `bin/thinkscript.js`. Ela permite validar arquivos `.think` e gerar apps a partir deles diretamente via terminal.

### Comandos disponíveis:
```bash
thinkscript build <entrada.think> <saida.html>
thinkscript validate <entrada.think>
thinkscript help
```

### Exemplos:
```bash
node bin/thinkscript.js build examples/clientes-produtos.think dist/index.html
node bin/thinkscript.js validate examples/tarefas.think
```

---

## 🗂️ Repositório
- `examples/tarefas.think` – exemplo básico com filtros e estatísticas
- `examples/clientes-produtos.think` – múltiplas entidades com relações
- `lib/` – interpretadores e parser
- `bin/` – CLI oficial
- `docs/spec.md` – especificação da linguagem
- `playground/` – ambiente visual de testes

---

## 📅 Status
Versão atual: `v0.6`
- Estável, funcional e com persistência
- Compatível com IA assistida
- Pronto para uso no Replit ou embarcado em editores

---

## ✨ Licença
MIT

---

## ✉️ Contato
Criado por Roberto Santos. Orientado e mantido por IA (OpenAI GPT-4o)

---
