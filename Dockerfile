FROM node:20 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

CMD [ "npm", "run", "start" ]
