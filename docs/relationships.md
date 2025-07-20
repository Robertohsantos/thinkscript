# ThinkScript - Proposta de Suporte a Relacionamentos (v0.2)

## 📅 Versão

Extensão da linguagem ThinkScript v0.1 para suportar **relacionamentos entre entidades**.

---

## 📝 Objetivo

Permitir que entidades possam ser conectadas entre si de forma declarativa, para viabilizar:

* Telas de relacionamento (ex: listar pedidos de um cliente)
* Referências cruzadas (ex: produto em pedido)
* Navegação encadeada e contextual

---

## ✨ Nova seção: `relacionamentos`

### Sintaxe:

```yaml
relacionamentos:
  - de: cliente
    para: pedido
    tipo: um-para-muitos
    via: cliente_id

  - de: pedido
    para: produto
    tipo: muitos-para-muitos
    via: pedido_produto
```

### Campos:

* `de`: entidade origem (quem tem)
* `para`: entidade destino (quem pertence)
* `tipo`: tipo do relacionamento (`um-para-um`, `um-para-muitos`, `muitos-para-muitos`)
* `via`: campo de ligação ou tabela intermediária

---

## 🔹 Exemplo completo com 3 entidades

```yaml
app:
  nome: "Gestão de Vendas"
  objetivo: "Relacionar clientes, pedidos e produtos"

entidade:
  - nome: "cliente"
    campos:
      - nome: texto
      - email: texto

  - nome: "pedido"
    campos:
      - cliente_id: texto
      - data: data

  - nome: "produto"
    campos:
      - nome: texto
      - preco: numero

relacionamentos:
  - de: cliente
    para: pedido
    tipo: um-para-muitos
    via: cliente_id

  - de: pedido
    para: produto
    tipo: muitos-para-muitos
    via: pedido_produto

interface:
  - tela: "Lista de Clientes"
    mostra: cliente[]

  - tela: "Pedidos por Cliente"
    mostra: pedido[]
    filtros:
      - cliente_id

  - tela: "Produtos no Pedido"
    mostra: produto[]
```

---

## 🦄 Possíveis recursos futuros

* `mostrar_com`: tela que exibe entidade relacionada dentro de outra
* `criar_com`: tela de criação de relacionamento (ex: adicionar produto a pedido)
* `carregar_via`: para permitir lazy loading sob demanda

---

## 🔧 Implementação futura no interpretador

* Validar estrutura do bloco `relacionamentos`
* Criar um mapa de relacionamento cruzado
* Permitir filtros automáticos por relações existentes
* Exibir dados relacionados de forma encadeada

---

## 🚀 Status

**Rascunho aprovado para versão ThinkScript v0.2**
