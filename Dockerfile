FROM ubuntu:20.04

LABEL maintainer="dimitrisadamis1994@gmail.com"
LABEL version="0.6"
LABEL description="This is custom Docker Image for \
                   the knotify web server."

# Disable Prompt During Packages Installation
ARG DEBIAN_FRONTEND=noninteractive

# Update Ubuntu Software repository
ENV TZ=Europe/Athens
ENV LANG=en_US.UTF-8
ENV SHELL=/usr/bin/bash
RUN apt-get update && apt-get upgrade -y
RUN apt-get update && apt-get install -y python3 python3-pip pipenv tzdata libcairo2 libpq-dev

# Copy files into container and install app dependanies
RUN mkdir /home/knotify_webserver
WORKDIR /home/knotify_webserver
COPY  . .
RUN pip install -r requirements.txt

# Set up entrypoint script for data migration and running local server
RUN chmod +x docker-entrypoint.sh

# run container as a non-root user
RUN adduser --disabled-password --no-create-home nonroot
USER nonroot