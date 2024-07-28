#!/bin/bash

# Wait for dependencies to be ready
/wait-for-it.sh db:5432 -- /wait-for-it.sh redis:6379 -- /wait-for-it.sh backend:8000 --

# Check if backend is ready
until curl -sS http://backend:8000 > /dev/null; do
  echo 'Waiting for backend'
  sleep 30
done

# Run the populate busyness command
python manage.py populate_busyness
