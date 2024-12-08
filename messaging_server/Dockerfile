# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

RUN chown -R node /usr/src/app

USER node

# Expose the port the app will run on
EXPOSE 4000

# Set environment variables for production (optional)
ENV NODE_ENV=production




# Start the application
CMD ["npm", "start"]
