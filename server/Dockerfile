FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Copy source code and drizzle migrations
COPY src ./src
COPY drizzle ./drizzle
COPY tsconfig.json ./

# Expose server port
EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

# Run migrations and start server
CMD ["bun", "run", "start"]