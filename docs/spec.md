# ThinkScript - Especificação da Linguagem v0.1

## ✨ Visão Geral
ThinkScript é uma linguagem declarativa e legível, criada para descrever a estrutura e lógica de aplicações web. Seu principal objetivo é servir como interface semântica entre criadores de aplicações e inteligências artificiais (LLMs), permitindo geração automatizada de código sem necessidade de conhecimento técnico em programação.

---

## 🔖 Blocos principais

### `app`
Define os metadados da aplicação:
```yaml
app:
  nome: "Lista de Tarefas"
  objetivo: "Gerenciar tarefas com categorias e relatórios"

entidade
Define a estrutura de dados (semelhante a uma tabela ou modelo de banco):
entidade:
  nome: "tarefa"
  campos:
    - descricao: texto
    - status: ["pendente", "concluída"]

interface
Define as telas da aplicação e seus componentes visuais:
interface:
  - tela: "Lista de Tarefas"
    mostra: tarefa[]
    filtros:
      - status
    acoes:
      - adicionar nova tarefa
      - marcar como concluída

📊 Tipos de Campos
Tipo	Descrição
texto	Entrada de texto simples
texto_longo	Área de texto multiline
numero	Campo numérico
booleano	Sim/não
data	Campo de data
[opções]	Lista de seleção fixa

🔹 Comandos adicionais
acoes
Permite configurar as interações do usuário com os dados:
acoes:
  - adicionar
  - editar
  - excluir
  - marcar como concluída

filtros
Permite adicionar filtros visuais por campos:
filtros:
  - categoria
  - status

ordenacao
Permite definir ordenação da lista de dados:
ordenacao:
  - por: data_limite
    ordem: crescente

📋 Exemplo completo
app:
  nome: "Lista de Tarefas"
  objetivo: "Gerenciar tarefas com categorias, datas, observações e relatórios"

entidade:
  nome: "tarefa"
  campos:
    - descricao: texto
    - categoria: ["Pessoal", "Trabalho", "Estudos"]
    - data_limite: data
    - status: ["pendente", "concluída"]
    - observacoes: texto_longo

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
      - total_pendentes
      - grafico_tarefas_por_categoria

🚀 Futuro
As próximas versões incluirão:

Bloco persistencia: integração com API, Firebase, localStorage

Bloco comportamento: regras condicionais e eventos

Validações de campo (ex: obrigatório, máximo de caracteres)

🛠️ Uso previsto
ThinkScript será utilizado como:

Linguagem de entrada no seu app builder

Representação exportável/importável de apps

Interface para agentes de IA interpretarem, validarem e expandirem aplicações

🔐 Versão
ThinkScript v0.1 - Julho 2025
