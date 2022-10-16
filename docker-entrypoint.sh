#!/bin/bash

# Wait for db to finish initializing
echo "Wait for db to initialize"
python3 manage.py wait_for_db

# Sleeping for 5 seconds to ensure all the other services are up
echo "Sleeping for 5 seconds to ensure all the other services are up"
sleep 5

# Apply database migrations
echo "Apply database migrations"
python3 manage.py migrate

# Start server
echo "Starting uwsgi server"
uwsgi --ini knotify_webserver/uwsgi.ini
