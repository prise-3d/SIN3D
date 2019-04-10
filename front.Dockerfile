FROM nginx:1.15.10-alpine

RUN apk add yarn
RUN mkdir app

COPY . /app

WORKDIR /app

RUN yarn install 
RUN yarn run app:build

RUN ["rm", "-r", "/usr/share/nginx/html"]
RUN ["mv", "/app/dist", "/usr/share/nginx/html"]
RUN ["chmod", "775", "-R", "/usr/share/nginx/html"]
CMD ["nginx", "-g", "daemon off;"]
