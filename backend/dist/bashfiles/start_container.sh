#!/bin/bash
echo "start_container.sh ran"
echo "USERNAME is: $USERNAME"
echo "SSH_PUB_KEY is: $SSH_PUB_KEY"

docker run -d \
  -e "SSH_PUB_KEY=$SSH_PUB_KEY" \
  -p 2001:22 \
  --name "$USERNAME" \
  instance
