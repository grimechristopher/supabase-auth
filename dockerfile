# Developed with node 21
FROM node:21-alpine
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code to the container
COPY . .
# Build the React app for production
RUN npm run build
# Expose the port your app runs on
EXPOSE 6443
# Command to run the application
CMD ["npm", "serve"]
