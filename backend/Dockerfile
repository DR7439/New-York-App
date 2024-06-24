# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory to /app
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .
COPY wait-for-it.sh /wait-for-it.sh

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run the Django development server with superuser creation
CMD ["bash", "-c", "/wait-for-it.sh db:5432 -- /wait-for-it.sh redis:6379 -- python manage.py migrate && \
                   python manage.py shell -c \"from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists() or User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')\" && \
                   python manage.py loaddata myapp/fixtures/interests.json && \
                   python manage.py runserver 0.0.0.0:8000"]
