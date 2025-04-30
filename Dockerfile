# Use official Node.js base image
FROM node:18

# Install ffmpeg and yt-dlp (with system break permission)
RUN apt-get update && \
    apt-get install -y ffmpeg python3-pip && \
    pip3 install yt-dlp --break-system-packages

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the app port
EXPOSE 10000

# Start the app
CMD ["node", "server.js"]
