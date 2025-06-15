# Étape 1: Build de l'application React/Vite
FROM node:18-alpine AS build

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installer toutes les dépendances
RUN npm install

# Copier le code source
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2: Serveur Nginx pour la production
FROM nginx:alpine

# Installer curl pour les health checks
RUN apk add --no-cache curl

# Supprimer la configuration par défaut de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis l'étape de build
COPY --from=build /app/dist /usr/share/nginx/html

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Créer les répertoires nécessaires avec les bonnes permissions
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /etc/nginx/conf.d

# Créer le fichier PID avec les bonnes permissions
RUN touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid

# Utiliser l'utilisateur non-root
USER appuser

# Exposer le port 3000 (pour correspondre à votre config)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]

# Étape 2: Serveur Nginx pour la production
FROM nginx:alpine

# Installer curl pour les health checks
RUN apk add --no-cache curl

# Supprimer la configuration par défaut de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis l'étape de build
COPY --from=build /app/dist /usr/share/nginx/html

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Créer les répertoires nécessaires avec les bonnes permissions
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /etc/nginx/conf.d

# Créer le fichier PID avec les bonnes permissions
RUN touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid

# Utiliser l'utilisateur non-root
USER appuser

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]