# Use Node.js LTS (Alpine for smaller size)
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose the API port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
