# build stage
FROM node:lts-alpine as build-stage

# Create app directory
WORKDIR /app

# Install all dependecies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 5678
