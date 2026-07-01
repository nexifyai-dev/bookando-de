# Bookando Frontend — Nginx Static Serving
FROM nginx:alpine

# Copy built React app
COPY build/ /usr/share/nginx/html/

# Copy nginx config for SPA routing
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
