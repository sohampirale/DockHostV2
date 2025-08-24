FROM ubuntu:latest

WORKDIR /app

COPY ./start_instance.sh .

RUN apt update && apt install -y openssh-server && mkdir -p ~/.ssh && chmod 700 ~/.ssh

CMD ["bash","start_instance.sh"]