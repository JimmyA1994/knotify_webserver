#!/bin/bash

# Wait for db to finish initializing
echo "Wait for db to initialize"
python3 manage.py wait_for_db

# Apply database migrations
echo "Apply database migrations"
python3 manage.py migrate

# Start server
echo "Starting uwsgi server"
uwsgi --ini knotify_webserver/uwsgi.ini
