# Build stage
FROM node:latest as builder
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install
# Copy the rest of the application source code
COPY . .
# Run the build process
RUN npm run build

# Nginx stage
FROM nginx:latest
# Copy the built files from the builder stage to the Nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose the port your application will run on
EXPOSE 6443
# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]
