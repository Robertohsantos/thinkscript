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

* Ser lida e gerada por humanos **ou IA**
* Servir como interface de entrada para **app builders assistidos por IA**
* Ser interpretada ou convertida em HTML/JS automaticamente

---

## 🚀 Recursos

* Declaração de entidades e campos (semelhança com bancos de dados)
* Geração de interfaces baseadas em tela
* Filtros, ordenação e ações padronizadas (CRUD)
* Expansão futura com comportamentos, eventos e persistência

---

## 🔧 Repositório

* `examples/` - exemplos reais em .think
* `lib/` - parser ThinkScript (converte .think para JSON)
* `docs/spec.md` - especificação oficial da linguagem

---

## 📆 Status

Versão atual: `v0.1`

* Estável para protótipos
* Parser funcional já disponível
* Geração automática de código em progresso

---

## ✨ Licença

MIT

---

## ✉️ Contato

Criado por Roberto Santos. Orientado e mantido por IA (OpenAI GPT-4o)

---
