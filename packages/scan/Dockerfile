# Dockerfile

# base image
FROM node:16

# create & set working directory
RUN mkdir -p /app
WORKDIR /app
# copy source files
COPY . /app
# install dependencies
RUN npm install pm2@latest -g
RUN npm install
RUN npm install dotenv

COPY run.sh /app/run.sh


CMD ./run.sh