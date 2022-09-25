FROM neoaggelos/knotify

LABEL maintainer="dimitrisadamis1994@gmail.com, neoaggelos@gmail.com"
LABEL version="0.1"
LABEL description="This is Docker image of knotify, \
                   a RNA secondary structure predictor, \
                   customized to accept celery tasks from knotify_webserver."

USER root
RUN apt-get update  && apt-get install -y python3-distutils python3-pip

WORKDIR /knotify
COPY requirements.txt tasks.py knotify_client.py ./
RUN /knotify/bin/python -m pip install -r requirements.txt
ENV PATH="${PATH}:/knotify/bin"
USER 879:879
