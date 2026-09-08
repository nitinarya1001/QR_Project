# Use a lightweight official Node.js image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json (and package-lock.json if you have one)
COPY package*.json ./

# Install the dependencies inside the container
RUN npm install

# Copy the server code and the public folder
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# The command to start the server
CMD ["npm", "run", "prod"]