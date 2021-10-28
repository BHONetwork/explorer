# Dockerfile

# base image
FROM node:16

# create & set working directory
RUN mkdir -p /app
WORKDIR /app
# copy source files
COPY . /app

# install dependencies
RUN npm install
RUN npm run build
CMD npm run start
