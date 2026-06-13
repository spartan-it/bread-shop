#!/bin/sh

# Start netcat HTTP server in the background for health checks on port 3000
while true; do 
  { echo -ne "HTTP/1.0 200 OK\r\nContent-Length: 2\r\n\r\nOK"; } | nc -l -p 3000
done &

# Run original postgres entrypoint
exec docker-entrypoint.sh postgres
