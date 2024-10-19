FROM node:18.15-alpine AS builder
WORKDIR /
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM node:18.15-alpine as final
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder ./dist ./dist

ARG version
ENV VERSION=$version

EXPOSE 3000
CMD npm run start:prod