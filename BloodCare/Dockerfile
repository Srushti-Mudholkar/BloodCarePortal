# Step 1: Start with Node.js (like installing Node on a fresh computer)
FROM node:20-alpine

# Step 2: Create a folder inside the container to put our code
WORKDIR /app

# Step 3: Copy package.json first (for dependency caching)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the code
COPY . .

# Step 6: Tell Docker which port our app uses
EXPOSE 8080

# Step 7: Start the server
CMD ["node", "server.js"]
