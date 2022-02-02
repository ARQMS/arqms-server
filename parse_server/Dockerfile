FROM node:lts

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install packages
RUN npm install

# Open port 1337
EXPOSE 1337

# Run npm start when container is booted
CMD npm start