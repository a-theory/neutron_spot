FROM node:16.13.1

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
# copy source code to /app/src folder
COPY lib /app/lib

RUN npm install

EXPOSE 5001
