FROM ubuntu:20.04

LABEL maintainer="dimitrisadamis1994@gmail.com"
LABEL version="0.1"
LABEL description="This is custom Docker Image for \
the knotify web server."

# Disable Prompt During Packages Installation
ARG DEBIAN_FRONTEND=noninteractive

# Update Ubuntu Software repository
ENV TZ=Europe/Athens
RUN apt update
RUN apt upgrade -y
RUN apt install -y python3 python3-pip pipenv libgsl23 tzdata libcairo2
ENV LANG=en_US.UTF-8
ENV SHELL=/usr/bin/bash
RUN mkdir /home/knotify_webserver
WORKDIR /home/knotify_webserver
COPY  . .
RUN pip install -r requirements.txt
ENTRYPOINT [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]