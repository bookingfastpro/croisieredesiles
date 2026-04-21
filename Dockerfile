# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the frontend (Vite)
RUN npm run build

# Stage 2: Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built frontend
COPY --from=builder /app/dist ./dist

# Copy server-side code and data
# We preserve the structure required by server.ts
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public

# Set directory permissions for data persistence
# This is where circuits.json and images will be stored/modified
RUN mkdir -p src/data public/images/circuits

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start command
# We use node's native TS stripping for the server
# This requires Node 22.6+ which is included in node:22-alpine
CMD ["node", "--experimental-strip-types", "server.ts"]
