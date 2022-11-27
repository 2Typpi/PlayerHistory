# Deployment

## Requirements

 - MYSQL: mysql db
 - npm: package manager
 - nodeJs: Server
 - nginX: Proxy Host
 - pm2: Deamonizing Tool
 - python: Script Language
 - pip: Package manager for python

## Install

Install all required tools on the System. Make sure to enable all needed Ports to be opened (Port: 80 and 443) and add load all Files from [Github](https://github.com/2Typpi/PlayerHistory.git). Make sure to change following code parts:

- PlayerHistory/utils/database.js: adjust to created dbUser
- PlayerHistory/clubstats/src/store/index.js: axios.defaults.baseURL "http://\<newURL>/api";

For production build navigate into the clubstats folder and run

> npm run build
 
Now copy the dist folder into **/var/www/clubstats/**. The Code is now deployed and ready.  
Make sure that python is installed if python3 is used change the code in: PlayerHistory/routes/stats.js to use python3 command. Install all packaged:

> pip install -r requirements.txt

Test python script:

> python bfv_players.py \<link>

You can already start the node server in a pm2 task: 

> pm2 start server.js

## nginx Configuration

To access the server from the internet we need to set up an reverse proxy server. The used configuration is: 

```
server {
        listen 80;
        server_name \<newURL>;

        charset utf-8;
        #Location of the dist folder
        root /var/www/clubstats/dist;

        index index.html;

      	# Backend location reached under http://\<newURL>/api/
        location /api/ {
                proxy_pass http://localhost:3001;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;

                # used to replace the used api link with nothing so the backend can be accessed
                rewrite ^/api/?(.*) /$1 break;

                proxy_cache_bypass $http_upgrade;
        }

        error_log  /var/log/nginx/vue-app-error.log;
        access_log /var/log/nginx/vue-app-access.log;
}
```

This config must be placed in the **/etc/nginx/sites-available** folder. To check the config use the **nginx -t** command and now restart the nginx service with **systemctl restart nginx**. 

If the server is not reachable, make sure to open all the needed Ports via: **ufw allow 'Nginx Full'**