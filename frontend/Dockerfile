# Frontend Dockerfile for Business Talk - Performance Optimized
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy package files
COPY package*.json ./

# Install dependencies using npm install
RUN npm install && npm cache clean --force

# Copy all frontend files
COPY . .

# Build the application with environment variables
RUN npm run build

# Production stage with Nginx - Performance Optimized
FROM nginx:alpine

# Copy optimized nginx main configuration
COPY nginx-main.conf /etc/nginx/nginx.conf

# Copy site-specific nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy public files (banner, uploads, etc.)
COPY --from=builder /app/public /usr/share/nginx/html

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

