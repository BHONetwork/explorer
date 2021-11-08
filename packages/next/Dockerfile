# Dockerfile

# base image
FROM node:16

# create & set working directory
RUN mkdir -p /app
WORKDIR /app
# copy source files
COPY . /app
COPY run.sh /app/run.sh
RUN chmod +x ./run.sh
# install dependencies
RUN npm install
RUN npm run build
CMD ./run.sh