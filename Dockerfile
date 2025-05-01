FROM node:18

# Install ffmpeg and yt-dlp
RUN apt-get update && \
    apt-get install -y ffmpeg python3-pip && \
    pip3 install yt-dlp

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Expose port
EXPOSE 10000

# Start server
CMD ["node", "server.js"]
