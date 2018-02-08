FROM node:8

# Install webpack, yarn and aurelia
RUN npm install --global typescript
RUN npm install --global webpack
RUN npm install --global yarn
RUN npm install --global supervisor
# RUN npm install --global aurelia-cli

# Copy files to the container
ADD tr-host/ tr-host/
ADD tr-app/ tr-app/

# Install packages for the app
WORKDIR /tr-app
RUN yarn
RUN webpack

# Install packages for the server
WORKDIR /tr-host
RUN yarn

# Run
EXPOSE 80
ENV NODE_ENV=production
CMD ["supervisor", "-w", "../../tr-host/src","../../tr-host/src/index"]
