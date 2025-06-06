# Base image
FROM node:18

# Set working directory
WORKDIR /

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
