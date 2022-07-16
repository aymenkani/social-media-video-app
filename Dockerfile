FROM node:alpine AS development
WORKDIR /app
COPY ./package*.json ./
RUN npm install --force --only=prod
COPY . .
RUN npm run build

FROM node:alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json ./
RUN npm install --force --only=prod
COPY . .
COPY --from=development /app ./dist

CMD ["node", "dist/apps/auth/main", "node", "dist/apps/content/main", "node", "dist/apps/main/main"]

