FROM node:18

WORKDIR /usr/src/app

#INSTALL DEPENDENCIES
COPY package*.json ./
RUN npm install

#BUNDLE APP SOURCE
COPY . .

CMD [ "npm","start" ]