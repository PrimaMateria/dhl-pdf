# Stage 1: Build frontend (client)
FROM node:18 AS client-build
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Stage 2: Set up backend (server)
FROM node:18 AS server-build
WORKDIR /app
COPY server ./server
WORKDIR /app/server
RUN npm install --production

# Stage 3: Prepare final image
FROM node:18
WORKDIR /app
# Copy over frontend build from client-build stage
COPY --from=client-build /app/client/dist ./client/dist
# Copy backend code
COPY --from=server-build /app/server ./server

# Set environment variables and expose ports as needed
ENV NODE_ENV=production
EXPOSE 3000  # or your server port

# Start the backend server 
CMD ["node", "server/src/app.js"]
