# CoDecision - Coolify & Docker Setup

Projeto preparado para deploy simples e performático no **Coolify** usando **Caddy** (sem dependência de Nginx) escutando na **porta incomum `9876`**.

## 🚀 Estrutura para o Coolify

O Coolify gerencia automaticamente o certificado SSL e o proxy reverso. Dentro do container, usamos o **Caddy 2 (Alpine)**, que é extremamente leve (~15MB), rápido e roda na porta **`9876`**.

---

### Como Rodar Localmente (Opcional)

Com Docker Compose:
```bash
docker compose up -d --build
```
Acesse em: **[http://localhost:9876](http://localhost:9876)**

---

## ⚙️ Deploy no Coolify

1. Crie uma nova aplicação no Coolify apontando para este repositório/pasta.
2. Selecione o tipo de build: **Docker Compose** ou **Dockerfile**.
3. Defina a porta interna de destino no Coolify para **`9876`**.
4. O Coolify fará o mapeamento automático do seu domínio/SSL para a porta `9876`.

---

## 📁 Arquivos

- [`Dockerfile`](file:///Users/marcosfsantos/Documents/CoDecision/Dockerfile): Imagem Caddy Alpine escutando diretamente na porta `9876`.
- [`docker-compose.yml`](file:///Users/marcosfsantos/Documents/CoDecision/docker-compose.yml): Orquestrador do container para o Coolify com a porta `9876:9876`.
- [`.env`](file:///Users/marcosfsantos/Documents/CoDecision/.env): Variável de porta configurável (`PORT=9876`).
- [`.dockerignore`](file:///Users/marcosfsantos/Documents/CoDecision/.dockerignore): Arquivos ignorados no contexto de build.
