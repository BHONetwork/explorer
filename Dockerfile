# Dockerfile

# base image
FROM node:16

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src
# copy source files
COPY . /usr/src

# install dependencies
RUN yarn install
CMD yarn run scan
