# Build stage
FROM oven/bun:1.3-alpine AS build
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . ./
ARG VITE_API_URL
ARG VITE_WS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN bun run build

# Production stage
FROM nginx:alpine
# Upgrade installed packages to resolve base Alpine CVEs
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]