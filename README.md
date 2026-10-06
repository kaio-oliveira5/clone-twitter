# Clone Twitter

Aplicação web inspirada em uma rede social de microblogging, desenvolvida como projeto de estudo e portfólio durante o curso de Desenvolvimento Full Stack Python da EBAC.

O projeto possui backend em Django com API REST e frontend em React + TypeScript, com autenticação JWT, relacionamento entre usuários, publicações, curtidas, comentários, busca de usuários, PWA e modo escuro.

## 🚀 Aplicação online

**Frontend:** https://clone-twitter-mu.vercel.app

**API:** https://clone-twitter-549r.onrender.com

> A aplicação principal é acessada pelo frontend. A URL do backend corresponde à API REST e não possui uma página na rota `/`.

## ✨ Funcionalidades

- Cadastro de usuários
- Login e autenticação com JWT
- Renovação de token JWT
- Edição de nome e bio
- Alteração de senha
- Upload de foto de perfil
- Seguir e deixar de seguir usuários
- Lista de seguidores e usuários seguidos
- Busca de usuários por nome ou username
- Feed com publicações dos usuários seguidos
- Criação de publicações
- Curtidas
- Comentários
- Layout responsivo para desktop, tablet e dispositivos móveis
- Navegação adaptada para dispositivos móveis
- PWA instalável
- Modo claro e modo escuro

## 🛠️ Tecnologias

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Simple JWT
- Gunicorn
- django-cors-headers
- Cloudinary

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS Modules
- PWA com `vite-plugin-pwa`

### Ferramentas e infraestrutura

- Git
- GitHub
- Render
- Vercel
- Neon PostgreSQL
- Cloudinary

## 🏗️ Arquitetura

O projeto é dividido em duas partes principais:

```text
clone-twitter/
├── config/             # Configurações e URLs do Django
├── posts/              # Modelos, serializers, views e testes de publicações
├── users/              # Usuários, autenticação e relacionamentos
├── frontend/           # Aplicação React + TypeScript
├── manage.py
├── pytest.ini
├── requirements.txt
└── README.md

A comunicação entre frontend e backend é realizada por meio de uma API REST.
React + TypeScript
        ↓
      Axios
        ↓
 Django REST Framework
        ↓
    PostgreSQL

🔐 Autenticação
A aplicação utiliza autenticação baseada em JWT.
Os tokens são armazenados no navegador e enviados automaticamente nas requisições autenticadas por meio de um interceptor do Axios.
As credenciais e configurações sensíveis são fornecidas por variáveis de ambiente e não são versionadas no Git.
📱 PWA
O frontend pode ser instalado como aplicativo por meio do suporte a Progressive Web App (PWA).
O projeto utiliza vite-plugin-pwa para geração do manifest e do Service Worker.
Características principais:
- Instalação como aplicativo
- Manifest configurado em português do Brasil
- Ícones para instalação
- Modo standalone
- Service Worker gerado durante o build
🌙 Dark Mode
A aplicação possui alternância entre tema claro e tema escuro, permitindo utilizar a interface em diferentes condições de iluminação.
🧪 Testes
O backend possui uma suíte de testes automatizados utilizando pytest e pytest-django.
No estado atual do projeto:
31 testes aprovados

Para executar os testes localmente:
pytest

⚙️ Como executar localmente
1. Clonar o repositório
git clone https://github.com/kaio-oliveira5/clone-twitter.git
cd clone-twitter

2. Backend
Crie e ative um ambiente virtual:
python -m venv venv

No Linux/WSL:
source venv/bin/activate

Instale as dependências:
pip install -r requirements.txt

Configure as variáveis de ambiente utilizadas pelo projeto, incluindo as credenciais do banco de dados, SECRET_KEY, configurações de CORS/CSRF e credenciais do Cloudinary.
Depois execute as migrações:
python manage.py migrate

Inicie o servidor:
python manage.py runserver

A API estará disponível localmente em:
http://127.0.0.1:8000

3. Frontend
Entre na pasta do frontend:
cd frontend

Instale as dependências:
npm install

Configure a variável VITE_API_URL apontando para a API desejada. Para desenvolvimento local, o projeto utiliza por padrão:
http://127.0.0.1:8000/api

Execute o frontend:
npm run dev

O Vite disponibilizará a aplicação localmente, normalmente em:
http://localhost:5173

🔧 Variáveis de ambiente
O projeto utiliza variáveis de ambiente para configurações sensíveis e específicas de cada ambiente.
Entre elas estão configurações relacionadas a:
- SECRET_KEY
- DEBUG
- ALLOWED_HOSTS
- CORS_ALLOWED_ORIGINS
- CSRF_TRUSTED_ORIGINS
- banco de dados PostgreSQL
- Cloudinary
- VITE_API_URL
Nunca coloque valores reais de senhas, chaves ou secrets diretamente no código ou no repositório.
🚀 Deploy
Frontend
O frontend está publicado na Vercel:
https://clone-twitter-mu.vercel.app
Backend
A API está publicada no Render:
https://clone-twitter-549r.onrender.com
O banco de dados PostgreSQL utilizado em produção está hospedado no Neon.
📚 Projeto acadêmico
Projeto desenvolvido para fins de estudo e portfólio durante a formação Profissão: Desenvolvedor Full Stack Python — EBAC.
O projeto foi desenvolvido utilizando uma arquitetura separada entre frontend e backend, com API REST como camada de comunicação.
👨‍💻 Autor
Kaio Oliveira
GitHub: https://github.com/kaio-oliveira5
```
