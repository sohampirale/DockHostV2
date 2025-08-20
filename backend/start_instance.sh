echo "$SSH_PUB_KEY" > ~/.ssh/authorized_keys

echo "username : $USERNAME"

echo "client SSH_PUB_KEY added to authorized_keys"

service ssh start

tail -f /dev/null
