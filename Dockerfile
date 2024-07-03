# syntax=docker/dockerfile:1

# This file is originally generated by docker init.
# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG PYTHON_VERSION=3.12.2
FROM python:${PYTHON_VERSION} AS base

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y sudo gcc default-libmysqlclient-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN useradd -m --uid "${UID}" appuser
RUN echo 'appuser:chamgeNe' | chpasswd
RUN usermod -aG sudo appuser

# Create a sudoers configuration file in /etc/sudoers.d/
RUN echo 'appuser localhost=(root) NOPASSWD: /usr/bin/npm' > /etc/sudoers.d/myuser \
    && chmod 440 /etc/sudoers.d/myuser \
    && chown root:root /etc/sudoers.d/myuser


RUN cd /home/appuser/
WORKDIR /home/appuser/

# Copy the source code into the container.
COPY . /home/appuser/

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    pip install --root-user-action=ignore --upgrade pip \
    && pip install --root-user-action=ignore mysqlclient \
    && pip install --root-user-action=ignore -r requirements.txt


RUN curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get -y install nodejs

# Switch to the non-privileged user to run the application.
# USER appuser

WORKDIR /home/appuser/Frontend/
RUN sudo /usr/bin/npm install
# RUN sudo -b /usr/bin/npm run dev

WORKDIR /home/appuser/

# Expose the port that the application listens on.
EXPOSE 8000

# Make migrations to the database
RUN python manage.py makemigrations

# Run the application.
CMD ["bash", "-c", "python manage.py migrate & python manage.py runserver 0.0.0.0:8000 & cd /home/appuser/Frontend/ && npm run dev"]