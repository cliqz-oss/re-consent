FROM node:9.6.1

WORKDIR /app/

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install --silent

CMD npm run build
