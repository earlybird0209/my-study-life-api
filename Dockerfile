# select your base image to start with
FROM node:latest

# Create app directory
# this is the location where you will be inside the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# copying packages first helps take advantage of docker layers
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm install -g pm2
RUN npm install -g sequelize-cli
RUN npm install --save @sendgrid/mail
RUN npm install cors

# Bundle app source
COPY . .

# Copy the migration script
# COPY migrate.sh /usr/src/app/migrate.sh
# RUN chmod +x /usr/src/app/migrate.sh

# Make this port accessible from outside the container
# Necessary for your browser to send HTTP requests to your Node app
EXPOSE 8080

# Command to run when the container is ready
# Separate arguments as separate values in the array
CMD [ "pm2-runtime", "server.js" ]

# Run the migration script as the entry point
# ENTRYPOINT ["/usr/src/app/migrate.sh"]

