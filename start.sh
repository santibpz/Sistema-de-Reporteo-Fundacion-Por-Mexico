DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# check if the current directory has this install.sh script
if [ ! -f "$DIR/install.sh" ]; then
    echo "Error: you need to be on the same directory as install.sh"
    exit 1
fi

# start the server
echo "----------- Starting server -----------"

# front-end
echo "starting front-end"
cd $DIR/incidentia/front
npm install
# start a new screen session named "front"
screen -S front -d -m

# run the command in the session
screen -S front -X stuff 'npm run dev\n' # TODO change to prod

# detach from the session
screen -S front -d

# back-end
echo "starting back-end"
cd $DIR/incidentia/back
npm install
# start a new screen session named "back"
screen -S back -d -m

# run the command in the session
screen -S back -X stuff 'npm run start\n'

# detach from the session
screen -S back -d

