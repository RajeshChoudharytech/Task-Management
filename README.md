# Task Management System

This project is a task management dashboard using Django (ASGI for WebSockets), React for the frontend, Celery for background tasks, Redis for task queuing, and PostgreSQL for the database.

## Table of Contents

- [Project Setup](#project-setup)
- [Running the Project](#running-the-project)
  - [Running with Docker](#running-with-docker)
  - [Running without Docker](#running-without-docker)
- [API Endpoints](#api-endpoints)

## Project Setup

To get started with this project, you'll need to follow the setup steps either for **Docker** or for running it manually in your local environment.

### Prerequisites

- Python 3.10+
- Node.js (for the frontend)
- PostgreSQL 13+
- Redis
- Docker & Docker Compose (for the Docker setup)

## Running the Project

### Running with Docker

To run this project using Docker, follow these steps:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-repo/task-management.git
    cd task-management
    ```

2. **Create a `.env` file**:

    Create a `.env` file in the root directory with the following environment variables:

    ```bash
    POSTGRES_DB=mydb
    POSTGRES_USER=myuser
    POSTGRES_PASSWORD=mypassword
    DATABASE_URL=postgres://myuser:mypassword@db:5432/mydb
    REDIS_URL=redis://redis:6379/0
    DJANGO_SECRET_KEY=your_secret_key
    ```

3. **Build and run the containers**:

    Build and run the app with:

    ```bash
    docker-compose up --build
    ```

    This command will start the following services:
    - Backend (Django + ASGI) on `http://localhost:8000`
    - Frontend (React) on `http://localhost:3000`
    - PostgreSQL on `localhost:5432`
    - Redis on `localhost:6379`
    - Celery Worker
    - Celery Beat

4. **Access the application**:

    - **Frontend**: Go to [http://localhost:3000](http://localhost:3000)
    - **Backend API**: Go to [http://localhost:8000/api/tasks/](http://localhost:8000/api/tasks/)

    The API and WebSocket will be running at these ports. Celery will handle background tasks (e.g., for long-running processes).

### Running without Docker

To run the application manually without Docker, follow these steps:

1. **Backend Setup (Django)**:

    1. **Clone the repository**:

        ```bash
        git clone https://github.com/your-repo/task-management.git
        cd task-management
        ```

    2. **Create a virtual environment and install dependencies**:

        ```bash
        python -m venv venv
        source venv/bin/activate  # On Windows use `venv\Scripts\activate`
        pip install -r requirements.txt
        ```

    3. **Set up the database (PostgreSQL)**:

        Create a new PostgreSQL database:

        ```bash
        psql -U postgres
        CREATE DATABASE mydb;
        CREATE USER myuser WITH PASSWORD 'mypassword';
        ALTER ROLE myuser SET client_encoding TO 'utf8';
        ALTER ROLE myuser SET default_transaction_isolation TO 'read committed';
        ALTER ROLE myuser SET timezone TO 'UTC';
        GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
        ```

        Add the database details to your `task_management/settings.py`:

        ```python
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': 'mydb',
                'USER': 'myuser',
                'PASSWORD': 'mypassword',
                'HOST': 'localhost',
                'PORT': '5432',
            }
        }
        ```

    4. **Run migrations and start the server**:

        ```bash
        python manage.py migrate
        python manage.py runserver
        python -m daphne -p 8000 task_management.asgi:application (If want to run for websockets)

        ```

2. **Frontend Setup (React)**:

    1. **Go to the frontend folder**:

        ```bash
        cd frontend
        ```

    2. **Install dependencies**:

        ```bash
        npm install
        ```

    3. **Run the frontend app**:

        ```bash
        npm start
        ```

        Your React app will be available at `http://localhost:3000`.

3. **Redis Setup**:

    Install Redis on your machine:

    - **On Ubuntu**:
      ```bash
      sudo apt-get install redis-server
      ```

    - **Start Redis**:
      ```bash
      redis-server
      ```

4. **Celery Setup**:

    Start the Celery worker in a separate terminal:

    ```bash
    celery -A task_management worker --loglevel=info
    ```

5. **WebSocket (Daphne)**:

    To enable WebSockets, use `daphne` for ASGI:

    ```bash
    daphne -b 0.0.0.0 -p 8000 task_management.asgi:application
    ```

## API Endpoints

Here are the local API endpoints:

1. **GET /api/tasks/** - Get all tasks
   ```http
   GET http://localhost:8000/api/tasks/

2. **POST /api/tasks/** - Create tasks
   ```http
   POST http://localhost:8000/api/tasks/

3. **GET /api/tasks/<id>** - Get task from id
   ```http
   GET http://localhost:8000/api/tasks/<id>
