FROM node:22-alpine

# Install git for hot-updates
RUN apk add --no-cache git

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# Create volume directory
RUN mkdir -p /app/data
VOLUME /app/data

# Copy and setup entrypoint script
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["entrypoint.sh"]
