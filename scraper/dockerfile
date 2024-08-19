#Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json .

# Copy prisma schema and generate prisma client (prisma generate and prisma migrate commands)
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

#Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production


COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]