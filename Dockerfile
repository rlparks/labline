FROM node:22 AS builder

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

RUN corepack enable pnpm && pnpm run build

FROM node:22-slim AS server

WORKDIR /app

COPY --from=builder /app/build ./build

ENV NODE_ENV=production

# internal port
EXPOSE 3000

# run!
CMD [ "node", "build" ]
