# Developed with node 21
FROM node:21-alpine as builder
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the app
COPY . .
# Build the React app for production
RUN npm run build


# Step 2: Set up the production environment
FROM nginx:stable-alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose the port your app runs on
# EXPOSE 6443
# # Command to run the application
# CMD ["npm", "run", "preview","--","--host","0.0.0.0"]

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]