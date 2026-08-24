# Imagem ultraleve com Caddy
FROM caddy:2-alpine

# Copiar script de entrada para injetar variáveis de ambiente no container em tempo de execução
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copiar arquivos estáticos para a raiz do Caddy
COPY index.html /usr/share/caddy/index.html
COPY src /usr/share/caddy/src

# Porta incomum para escuta interna do container
EXPOSE 9876

ENTRYPOINT ["/entrypoint.sh"]
CMD ["caddy", "file-server", "--root", "/usr/share/caddy", "--listen", ":9876"]
