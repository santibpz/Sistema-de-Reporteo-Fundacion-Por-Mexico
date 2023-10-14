# check for elevated privileges
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root"
    exit 1
fi

# get variables to use later on
echo "----------- Getting variables -----------"

# get the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# check if the current directory has this install.sh script
if [ ! -f "$DIR/install.sh" ]; then
    echo "Error: you need to be on the same directory as install.sh"
    exit 1
fi
# get the server name/ip
echo "Enter the server name or ip address"
read SERVER_NAME
# ask if using http or https
echo "Do you want to use http or https? (http/https)"
read PROTOCOL

echo "Enter the mongodb uri"
read MONGOURI

# install dependencies
echo "----------- Installing dependencies -----------"
exho "updating apt"
sudo apt update

# install mongodb
# echo "installing mongodb"
# sudo apt-get install gnupg curl

# install node
echo "installing node"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# install nginx
echo "installing nginx"
sudo apt install nginx
sudo ufw allow 'Nginx HTTP'

# install certbot if using https
if [ "$PROTOCOL" == "https" ]; then
    echo "installing certbot"
    sudo apt install certbot python3-certbot-nginx
fi

# nginx config
echo "----------- Configuring nginx -----------"

NGINXPATH="/etc/nginx/"
cp $DIR/incidentia/nginx/nginx.conf $NGINXPATH

# find server_name test.local; and replace it with the server name
sed -i "s/server_name test.local;/server_name $SERVER_NAME;/g" $NGINXPATH/nginx.conf

sudo systemctl restart nginx

# certbot config
if [ "$PROTOCOL" == "https" ]; then
    echo "----------- Configuring certbot -----------"
    sudo certbot --nginx -d $SERVER_NAME
    sudo systemctl restart nginx
fi

# config .env files
echo "----------- Configuring .env files -----------"
echo "configuring front-end .env file"
touch $DIR/incidentia/front/.env

# add lines to the .env file
if [ "$PROTOCOL" == "https" ]; then
    echo "VITE_SIMPLE_REST_URL=https://$SERVER_NAME/api" >> $DIR/incidentia/front/.env
else
    echo "VITE_SIMPLE_REST_URL=http://$SERVER_NAME/api"  >> $DIR/incidentia/front/.env
fi

echo "configuring back-end .env file"
touch $DIR/incidentia/back/.env

# add lines to the .env file
echo "PORT = 8081" >> $DIR/incidentia/back/.env
echo "MONGODB_URI=$MONGOURI" >> $DIR/incidentia/back/.env
echo "CONSOLE_LOG_LEVEL = 3" >> $DIR/incidentia/back/.env # Log everything to console
echo "DB_LOG_LEVEL = 3" >> $DIR/incidentia/back/.env # Log everything to db

echo "Visual confirmation:"
echo "front-end .env file:"
cat $DIR/incidentia/front/.env
echo "back-end .env file:"
cat $DIR/incidentia/back/.env

# start the server
echo "----------- Starting server -----------"
# run ./start.sh as non admin
sudo -u $SUDO_USER $DIR/start.sh

# server testing
echo "----------- Testing server -----------"
# capture the output of the curl command
if [ "$PROTOCOL" == "https" ]; then
    curl_output=$(curl -k -s -o /dev/null -w "%{http_code}" https://$SERVER_NAME/api)
else
    curl_output=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_NAME/api)
fi

if [ "$curl_output" == "200" ]; then
    echo "Server is up and running and seems to be configured correctly."
else
    echo "There was an error while configuring the server you are on your own mate. Good luck :3"
fi