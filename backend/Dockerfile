# Production Dockerfile for White Mist Dishwashers Backend Service
FROM node:24-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose server port
EXPOSE 5000

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Run server
CMD ["node", "src/server.js"]
