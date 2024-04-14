# Use official Node.js image as base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all project files to the working directory
COPY . .

# Expose port 9600
EXPOSE 9600

# Command to run the application
CMD ["node", "src/index.js"]
