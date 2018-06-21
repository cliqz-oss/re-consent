FROM node:9.6.1

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json

RUN npm install --silent

CMD ["npm", "start"]
