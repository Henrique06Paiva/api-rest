# 🚀 API Restful & React Dashboard - Gerenciamento de Usuários e Produtos

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)

Um projeto *Full-Stack* moderno desenvolvido para portfólio, consistindo em uma **API RESTful** robusta em Node.js no backend e um **Dashboard elegante** em React no frontend. O sistema realiza o gerenciamento completo (CRUD) de Usuários e Produtos integrado ao banco de dados NoSQL Cloud Firestore.

## ✨ Destaques e Funcionalidades

- **Design Premium UI/UX:** Frontend construído do zero utilizando React (Vite) e CSS puro, seguindo padrões modernos de design (tipografia geométrica, cores quentes, e layouts consistentes).
- **Validação Rigorosa (Fail-Fast):** Rotas de backend protegidas contra dados malformados, rejeitando requisições inválidas antes mesmo de consultar o banco de dados.
- **Atualizações Parciais Inteligentes:** Uso correto de métodos REST (como PATCH para atualizações parciais), evitando perda de dados e minimizando tráfego de rede.
- **Integração Real-Time:** Conexão assíncrona ao Firebase Firestore para operações rápidas e com alta disponibilidade.

## 🛠️ Tecnologias Utilizadas

**Backend:**
- Node.js & Express
- Firebase Admin SDK (Firestore)
- CORS Middleware

**Frontend:**
- React 18+ (via Vite)
- Axios (para consumo da API REST)
- Vanilla CSS Customizado (Componentização de UI sem frameworks)

## 🗂️ Estrutura do Projeto

O projeto adota uma arquitetura MVC-Like, separando responsabilidades de forma clara:

```text
├── back-end/
│   ├── src/
│   │   ├── config/          # Conexão e credenciais do Firebase
│   │   ├── controllers/     # Lógica de negócio e validações
│   │   └── routes/          # Definição dos endpoints da API
│   └── server.js            # Ponto de entrada do Backend
└── front-end/
    ├── src/
    │   ├── components/      # Componentes reutilizáveis (Sidebar, Navbar)
    │   ├── pages/           # Telas completas (UsersPage, ProductsPage)
    │   └── services/        # Abstração das chamadas HTTP via Axios
    └── App.jsx              # Roteamento e estrutura do layout
```

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js instalado (v16 ou superior)
- Conta no Firebase com um banco de dados Firestore configurado
- Arquivo `firebase-key.json` com suas credenciais de serviço do Firebase

### 1. Configurando o Backend
```bash
# Entre na pasta do backend
cd back-end

# Instale as dependências
npm install

# (IMPORTANTE) Crie uma pasta 'src/config' e cole o seu 'firebase-key.json' lá dentro.

# Inicie o servidor
npm run dev
# O servidor rodará na porta 3000
```

### 2. Configurando o Frontend
Abra um novo terminal e siga os passos:
```bash
# Entre na pasta do frontend
cd front-end

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 📡 Referência da API (Endpoints)

| Método | Rota                | Descrição |
|--------|---------------------|-----------|
| `GET`  | `/users`            | Lista todos os usuários cadastrados |
| `POST` | `/users`            | Cria um novo usuário |
| `PATCH`| `/users/:name`      | Atualiza parcialmente os dados de um usuário |
| `DELETE`| `/users/:name`     | Remove um usuário específico |
| `GET`  | `/products`         | Lista todos os produtos |
| `POST` | `/products`         | Cadastra um novo produto |
| `PATCH`| `/products/:name`   | Atualiza parcialmente os dados de um produto |
| `DELETE`| `/products/:name`  | Deleta um produto do catálogo |

---
*Desenvolvido com dedicação para aprimoramento contínuo das habilidades Full-Stack.*
