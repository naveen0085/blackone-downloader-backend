# Use official Node base image
FROM node:18

# Install yt-dlp and ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg python3-pip && \
    pip3 install yt-dlp

# Set working directory
WORKDIR /app

# Copy all files into container
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the port your app uses
EXPOSE 10000

# Run the app
CMD ["node", "server.js"]
