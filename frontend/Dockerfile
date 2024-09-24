# Frontend Dockerfile

# Use a node base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Serve the application (you might want to use serve package or similar)
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
