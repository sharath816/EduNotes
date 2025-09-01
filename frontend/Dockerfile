# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start Next.js
CMD ["npm", "run", "dev"]
