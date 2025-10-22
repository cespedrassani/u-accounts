# 📊 uContas - Accounts Plan App

Aplicativo mobile para gerenciamento hierárquico de plano de contas, desenvolvido com React Native + Expo.

## 🚀 Funcionalidades

- ✅ Cadastro de contas com código hierárquico (ex: 1.2.5)
- ✅ Sugestão automática de código baseado na hierarquia
- ✅ Validação completa de regras de negócio
- ✅ Visualização detalhada de contas e suas filhas
- ✅ Exclusão de contas (com validação de dependências)
- ✅ Busca de contas por código ou nome
- ✅ Diferenciação visual entre Receitas e Despesas
- ✅ Animações fluidas e feedback visual

## 🛠️ Tecnologias

### Core
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### UI/UX
- **React Native Gesture Handler** - Gestos e interações
- **React Native Keyboard Controller** - Controle de teclado
- **Expo Vector Icons** - Ícones

### Estado e Persistência
- **Context API** - Gerenciamento de estado global
- **AsyncStorage** - Armazenamento local

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta
cd u-accounts

# Instale as dependências
npm install

# Execute o app
npm start
```

### Pré-requisitos
- Node.js >= 18
- Expo CLI
- Expo Go (app mobile) ou emulador Android/iOS

## 📱 Como Usar

### 1. Criando uma Conta Raiz
- Clique no botão `+` na tela inicial
- Deixe o campo "Conta pai" como "Nova conta"
- O código será sugerido automaticamente (1, 2, 3...)
- Preencha nome e tipo (Receita/Despesa)
- Defina se aceita lançamentos

### 2. Criando uma Conta Filha
- Na lista, clique em uma conta que **não aceita lançamentos**
- Na tela de detalhes, clique no botão `+`
- O código será sugerido automaticamente (ex: se pai é 1.2, sugere 1.2.1)
- Preencha os dados e salve

### 3. Buscando Contas
- Use a barra de busca na tela inicial
- Digite código (ex: "1.2") ou nome da conta
- A lista filtra em tempo real

### 4. Excluindo Contas
- Na lista, clique no ícone de lixeira
- Confirme a exclusão
- ⚠️ Não é possível excluir contas que possuem filhas

## 🎯 Regras de Negócio

### Hierarquia de Códigos
- Contas raiz: `1`, `2`, `3`... até `999`
- Subcontas: adiciona `.X` ao código do pai
- Exemplo: `1` → `1.2` → `1.2.5` → `1.2.5.10`
- Cada segmento: mínimo `1`, máximo `999`

### Limite de Filhos
- Cada conta pode ter no máximo 999 filhos diretos
- Ao atingir o limite (ex: `1.2.999`):
  - Sistema **troca automaticamente o pai** para o nível superior
  - Sugere o próximo código disponível (ex: `1.3`)
  - Exibe banner explicativo

### Tipos
- **Receita** (verde) ou **Despesa** (laranja)
- Filhas devem ter o **mesmo tipo** que a conta pai
- Campo de tipo fica bloqueado quando há pai selecionado

### Lançamentos
- Conta que **aceita lançamentos** = conta final (não pode ter filhas)
- Conta que **não aceita lançamentos** = conta agrupadora (pode ter filhas)

## 📁 Estrutura do Projeto

```
accounts-plan-app/
├── src/                        # Código fonte
│   ├── app/                   # Rotas e telas (Expo Router)
│   │   ├── _layout.tsx       # Layout raiz
│   │   ├── index.tsx         # Tela inicial
│   │   ├── account-detail.tsx # Detalhes da conta
│   │   └── account-form.tsx  # Formulário de cadastro
│   │
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes de UI genéricos
│   │   │   ├── badge.tsx
│   │   │   ├── header.tsx
│   │   │   ├── form-field.tsx
│   │   │   └── ...
│   │   ├── account-item.tsx  # Item da lista
│   │   ├── picker-input.tsx  # Select customizado
│   │   └── ...
│   │
│   ├── screens/               # Lógica das telas
│   │   ├── home/
│   │   ├── account-detail/
│   │   └── account-form/
│   │
│   ├── services/              # Camada de serviços
│   │   ├── account.service.ts # CRUD de contas
│   │   └── storage.service.ts # AsyncStorage
│   │
│   ├── contexts/              # Context API
│   │   └── accounts.context.tsx # Estado global das contas
│   │
│   ├── utils/                 # Funções utilitárias
│   │   ├── account-code.utils.ts  # Lógica de códigos
│   │   ├── account-validation.utils.ts # Validações
│   │   └── animations.ts     # Helpers de animação
│   │
│   ├── schemas/               # Schemas Zod
│   │   └── account.schema.ts
│   │
│   ├── types/                 # Definições TypeScript
│   │   └── account.ts
│   │
│   └── constants/             # Constantes
│       ├── theme.ts          # Cores e temas
│       ├── values.ts         # Valores mágicos
│       ├── account-types.ts  # Labels e opções
│       └── common-styles.ts  # Estilos compartilhados
│
├── assets/                    # Assets estáticos
├── index.js                   # Entry point
├── app.json                   # Configuração Expo
├── tsconfig.json              # Configuração TypeScript
├── metro.config.js            # Configuração Metro Bundler
├── package.json               # Dependências do projeto
└── .editorconfig              # Configuração do editor
```

### Principais Validações
✅ Código duplicado
✅ Formato correto do código
✅ Hierarquia consistente (filho direto do pai)
✅ Limite de 999 filhos por conta
✅ Tipo igual ao pai
✅ Conta que aceita lançamentos não pode ter filhas

## 🎨 Design System

### Cores
- **Background:** `#622490` (roxo)
- **Receita:** `#22A447` (verde)
- **Despesa:** `#FF7A3D` (laranja)
- **Texto:** `#6C6C80` (cinza)

### Animações
- Entrada de tela: Spring animation
- Lista de itens: Staggered fade-in
- Modais: Slide up com backdrop

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o Expo
npm run android        # Abre no emulador Android
npm run ios           # Abre no simulador iOS
npm run web           # Abre no navegador

# Build
npm run build         # Gera build de produção
```

## 📝 Padrões de Código

### TypeScript
- Tipagem forte em todo o código
- Interfaces para props de componentes
- Types para retornos de funções

### React
- Componentes funcionais com hooks
- Custom hooks para lógica reutilizável
- Context API para estado global

### Performance
- `useMemo` para computações custosas
- `useCallback` para funções em dependencies
- `useNativeDriver` para animações

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido como parte de um teste técnico.
