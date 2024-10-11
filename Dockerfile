FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the app
CMD ["node", "dist/server.js"]
