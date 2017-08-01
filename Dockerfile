FROM node:alpine

# Install webpack, yarn and aurelia
RUN npm install --global webpack
RUN npm install --global yarn
RUN npm install --global aurelia-cli

# Copy files to the container
ADD tr-server/ tr-server/
ADD tr-app/ tr-app/

# Install packages for the server
RUN npm --prefix ./tr-server install ./tr-server

# Install packages for the app
WORKDIR tr-app/
RUN npm install
RUN yarn install

# Run
EXPOSE 8080
CMD ["npm", "start"]