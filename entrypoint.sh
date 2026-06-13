#!/bin/sh

# Ensure git repository is initialized for hot-updates
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  git remote add origin https://github.com/spartan-it/bread-shop.git
  git fetch --all
  git reset --hard origin/main
  git branch --set-upstream-to=origin/main main
fi

# Run Express server in a loop to support hot-restart on process.exit(0)
while true; do
  echo "Starting Burger Shop..."
  node server.js
  echo "Burger Shop stopped. Restarting in 2 seconds..."
  sleep 2
done
