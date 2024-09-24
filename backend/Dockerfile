# backend/Dockerfile

# Base image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY ./backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory into the container
COPY ./backend /app

# Expose port 8000
EXPOSE 8000

# Command to run the Django app using Daphne (ASGI server)
CMD ["sh", "-c", "python manage.py migrate && daphne -b 0.0.0.0 -p 8000 task_management.asgi:application"]
