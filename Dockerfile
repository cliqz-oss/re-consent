FROM node:9.6.1

WORKDIR /app/

COPY package.json /app/

RUN npm install --silent

CMD npm start
