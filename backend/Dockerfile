FROM node:18

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install only production deps first
RUN npm install

# Copy entire backend source
COPY . .

# Generate Prisma Client properly for Linux
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# Expose API port
EXPOSE 3001

# Start backend
CMD ["npm", "start"]
