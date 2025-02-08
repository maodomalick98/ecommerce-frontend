FROM node:20-alpine as builder

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package.json package-lock.json ./

RUN npm install

COPY . . 

RUN npm run build -- --configuration=development

FROM nginx:stable-alpine

COPY --from=builder /home/app/dist/ecommerce-frontend /usr/share/nginx/html

