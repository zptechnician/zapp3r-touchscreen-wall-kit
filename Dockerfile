# Stage 1 — Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json bun.lock* package-lock.json* ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Stage 2 — Serve (unprivileged — runs as nginx user, not root)
# nginxinc/nginx-unprivileged listens on 8080 by default and drops root privileges
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
