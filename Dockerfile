FROM node:22 as builder

WORKDIR /app

COPY package.json ./

RUN npm i

# copy code
COPY . .

# build
RUN npm run build

# lighter image
FROM node:22-slim as server

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src/lib/db/schema.ts ./src/lib/db/schema.ts

ENV NODE_ENV=production

RUN npm i 

# internal port
EXPOSE 3000

# run!
CMD [ "node", "build" ]
