# Icewar Monorepo

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Err0r51/icewar/release.yml?branch=main)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/Err0r51/icewar)


## Overview

Icewar is a PNPM monorepo project that includes multiple components with a frontend, and a crawler/backend. The project uses various technologies including React, TypeScript, Vite, Prisma, and Docker.

## Project Structure

- `frontend`: A vanilla React SPA with Vite that serves the frontend.
- `backend`: A TS application with [Prisma](https://www.prisma.io/) and a [Nitro.js](https://nitro.unjs.io/) webserver  that serves as the backend of the project.
- `Prisma`: A database ORM that is used to interact with the database.

## Deployment
The project is deployed using Docker and Docker-compose. The frontend and backend are deployed as separate services in the same network. The infrastructure is managed using Coolify.
