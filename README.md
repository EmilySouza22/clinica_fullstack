# Clinica FullStack

![Typescript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## Sobre o Projeto

Este projeto é uma aplicação fullstack para gestão de clínicas, com foco em organizar cadastros, consultas, exames e prontuários em um único ambiente. A ideia é facilitar o dia a dia da equipe, oferecendo uma interface simples para o frontend em React e uma API robusta em Node.js com TypeScript, usando Prisma e PostgreSQL para armazenar e consultar os dados de forma segura.

## Funcionalidades

- Cadastro e autenticação de usuários
- Cadastro de pacientes
- Registro de consultas
- Registro de exames
- Visualização de prontuários
- Painel com contadores e listagens principais

## Tecnologias utilizadas

- Frontend: React, Vite, Axios, Tailwind CSS, React Router
- Backend: Node.js, TypeScript, Express
- Banco de dados: PostgreSQL com Prisma ORM
- Autenticação: JWT

## Estrutura

```text
clinica_fullstack/
├── backend/
│   ├── postman/
│   ├── src/
│   │   ├── prisma/
├── frontend/
│   ├── docs/
│   ├── src/
├── .gitignore
└── README.md
```

## Instalação e execução

1. Clone o repositório
2. Instale as dependências do backend:
   - cd backend
   - npm install
3. Configure as variáveis de ambiente e aplique as migrations do Prisma
4. Inicie o backend:
   - npm start
5. Em outro terminal, instale as dependências do frontend:
   - cd frontend
   - npm install
6. Inicie o frontend:
   - npm run dev

O backend normalmente fica em http://localhost:3000 e o frontend em http://localhost:5173.
