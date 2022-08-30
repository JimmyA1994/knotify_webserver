#!/bin/bash

# Wait for db to finish initializing
echo "Wait for db to initialize"
python3 manage.py wait_for_db

# Apply database migrations
echo "Apply database migrations"
python3 manage.py migrate

# Start server
echo "Starting server"
python3 manage.py runserver 0.0.0.0:8000
