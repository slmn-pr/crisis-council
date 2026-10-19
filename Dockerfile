FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:client

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/schema.sql ./schema.sql
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
