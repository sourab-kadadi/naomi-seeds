FROM node:16.13-alpine as build
WORKDIR /app
COPY package*.json /app/
COPY nginx-custom.conf /app/
RUN npm install
COPY ./ /app/
RUN npm install -g ionic
RUN ionic build --prod
FROM nginx:1.15.8-alpine
# RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/n`ginx.conf
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/www/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf