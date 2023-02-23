FROM node:19-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build:dist:clean
RUN npm run prettier:check
RUN npm run lint:ci
RUN npm run build:dist
EXPOSE 8080
CMD ["node", "./build/index.js"]