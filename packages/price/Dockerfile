# Dockerfile

# base image
FROM node:16

# create & set working directory
RUN mkdir -p /app
WORKDIR /app
# copy source files
COPY . /app
# install dependencies
RUN yarn install
CMD yarn run deploy:priceDot
