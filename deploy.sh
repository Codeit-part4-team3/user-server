#!/bin/bash
cd /home/ubuntu/user-server
git pull origin main
sudo npm install
sudo npm run build
pm2 restart ecosystem.config.js
