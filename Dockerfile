FROM node:18-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y python3-pip ffmpeg curl && \
    pip3 install yt-dlp

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install
COPY . .

# Expose port and run server
EXPOSE 10000
CMD ["node", "server.js"]

