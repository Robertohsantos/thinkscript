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
- Expansão futura com comportamentos, eventos e persistência

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

## 🧩 Interpretação com múltiplas telas e entidades

O arquivo `lib/multi-entity-generator.js` permite gerar aplicações com múltiplas entidades e múltiplas telas declaradas em ThinkScript. Cada `tela` é transformada em uma seção com navegação, formulário e listagem de dados. O sistema identifica automaticamente qual entidade corresponde à tela.

✔️ O app gerado inclui:
- Navegação entre telas via botões
- Formulários automáticos com base em cada entidade
- Listas de dados independentes por tipo
- Código HTML/JS puro, executável localmente (SPA leve)

### Como gerar:
```bash
node lib/multi-entity-generator.js
```
Resultado: arquivo HTML gerado em `./dist/index.html`

---

## 🗂️ Repositório
- `examples/tarefas.think` – exemplo básico de tarefa com filtros e estatísticas
- `examples/clientes-produtos.think` – exemplo de múltiplas entidades com telas separadas
- `lib/` – parser e interpretadores (simples, multi-tela e multi-entidade)
- `docs/spec.md` – especificação oficial da linguagem
- `playground/` – playground visual local para rodar apps declarativos

---

## 📅 Status
Versão atual: `v0.1`
- Estável para protótipos
- Parser funcional já disponível
- Geração automática de código ativa
- Playground local funcionando
- Interpretação com múltiplas entidades e telas disponível

---

## ✨ Licença
MIT

---

## ✉️ Contato
Criado por Roberto Santos. Orientado e mantido por IA (OpenAI GPT-4o)

---
