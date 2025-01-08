FROM python:3.11-slim

ENV PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  # Poetry's configuration:
  POETRY_NO_INTERACTION=1 \
  POETRY_VIRTUALENVS_CREATE=false \
  POETRY_CACHE_DIR='/var/cache/pypoetry' \
  POETRY_HOME='/usr/local' \
  POETRY_VERSION=2.0.0

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN apt-get update && apt-get install -y curl && \
  # Install Poetry
  curl -sSL https://install.python-poetry.org | python - && \
  # Install project dependencies
  poetry install --no-dev --no-root --without dev && \
  # Remove build dependencies
  apt-get remove -y curl && \
  apt-get autoremove -y && \
  # Clean up
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  rm -rf /root/.cache

# Make port 8000 available to the world outside this container
EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]