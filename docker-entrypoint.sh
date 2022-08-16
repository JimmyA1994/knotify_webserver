#!/bin/bash

# Wait for the db to apply migrations
echo "Sleeping for 5 seconds..."
sleep 5

# Apply database migrations
echo "Apply database migrations"
python3 manage.py migrate

# Start server
echo "Starting server"
python3 manage.py runserver 0.0.0.0:8000
