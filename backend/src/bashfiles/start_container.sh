#!/bin/bash
echo "start_container.sh ran"
echo "USERNAME is: $USERNAME"
echo "SSH_PUB_KEY is: $SSH_PUB_KEY"

docker run -d \
  -e "SSH_PUB_KEY=$SSH_PUB_KEY" \
  -p "$TCP_PORT:22"\
  -p "$HTTP_PORT:80"\
  -p "$HTTPS_PORT:443"\
  --name "$USERNAME" \
  instance
