# Static site container for ChorusClip

FROM nginx:1.27-alpine

# Install curl for webhook notify
RUN apk add --no-cache curl

# Set workdir
WORKDIR /usr/share/nginx/html

# Copy site assets
COPY index.html ./
COPY styles.css ./
COPY app.js ./
COPY logo.png ./
COPY favicon.ico ./
COPY robots.txt ./
COPY sitemap.xml ./

# Nginx config with SPA fallback for /{lang}/ paths
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Webhook URL can be overridden at runtime
ENV WEBHOOK_URL="http://148.230.85.245:3000/api/deploy/uFRk_Mh0ApqgAdZeu89Hy"

# Entry script: ping webhook then run nginx
COPY docker-entrypoint.sh /docker-entrypoint.d/10-webhook.sh
RUN chmod +x /docker-entrypoint.d/10-webhook.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

# Use default nginx CMD; scripts in /docker-entrypoint.d run automatically

