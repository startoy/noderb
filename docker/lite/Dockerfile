FROM node:10.10.0-alpine

WORKDIR /app
COPY ../../. /app
RUN npm install

EXPOSE 15673
CMD ["npm", "start"]