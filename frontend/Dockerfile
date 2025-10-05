FROM node:22 AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --silent
COPY angular.json tsconfig.app.json tsconfig.json ./
COPY src/ ./src/
RUN npm run build --silent

FROM nginx:stable-alpine
COPY --from=builder /app/dist/frontend/browser/. /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
