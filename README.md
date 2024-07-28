# Ad Optima

Ad Optima is a web application designed to optimize Out Of Home (OOH) advertising in Manhattan. By utilizing a variety of open datasets, Ad Optima helps businesses select strategic advertising locations to maximize consumer engagement and foot traffic.

The application can temporarily be accessed at [Ad Optima](https://adoptima.online).

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Installation](#installation)
   - [Prerequisites](#prerequisites)
   - [Setup Instructions](#setup-instructions)
4. [Usage](#usage)

## Features

- **Data Integration:** Leverages diverse datasets, including:
  - Taxi and subway data
  - Census demographics
  - Business listings
  - OOH sign location data
- **Robust Backend:** Built with Django, Django Rest Framework, Celery, Redis, and PostgreSQL.
- **Responsive Frontend:** Developed with React and associated technologies.
- **Agile Development:** Utilizes iterative testing and continuous integration with GitHub Actions.
- **Advanced Targeting:** Provides advanced targeting options to enhance advertising strategies.
- **Data-Driven Recommendations:** Offers suggestions for optimal advertising spots based on data analysis.

### Backend

- **Django:** The core framework used for handling business logic and data management.
- **Django Rest Framework:** Provides API endpoints for frontend communication.
- **Celery:** Manages background tasks and asynchronous processing.
- **Redis:** Serves as the message broker for Celery tasks.
- **PostgreSQL:** The primary database for storing application data.

### Frontend

- **React:** The main library used for building the user interface.
- **Tailwind CSS:** Used for styling and responsive design.
- **Vite:** The build tool for bundling and optimizing frontend assets.

### Deployment

- **Docker:** Containerization of the application to ensure consistency across different environments.
- **Docker Compose:** Orchestrates the multi-container setup for development and production.

## Installation

To set up the project locally, follow these steps:

### Prerequisites

- Docker Engine
- Docker Compose

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/DR7439/New-York-App.git
   cd New-York-App

## Installation

### Create a `.env` file

Create a `.env` file in the project root with the necessary environment variables. Example contents:

SECRET_KEY=your_secret_key
DEBUG=True
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=db
DB_PORT=5432
DJANGO_SUPERUSER_USERNAME=your_admin_username
DJANGO_SUPERUSER_EMAIL=your_admin_email
DJANGO_SUPERUSER_PASSWORD=your_admin_password
EMAIL_HOST_USER=your_email_user
EMAIL_HOST_PASSWORD=your_email_password
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CHOKIDAR_USEPOLLING=true

## Build and Run the Application

Use Docker Compose to build and run the application. From the project root, execute:

docker-compose up -d

## Usage

Once the application is running, you can access the following:

- **Frontend:** Open your web browser and navigate to [http://localhost:3000](http://localhost:3000)
- **Backend:** Open your web browser and navigate to [http://localhost:8000](http://localhost:8000)
- **Django Admin:** Open your web browser and navigate to [http://localhost:8000/admin](http://localhost:8000/admin) (use the superuser credentials specified in your `.env` file)

**Note:** When interacting with the APIs, ensure that you use `localhost` in your API requests.



