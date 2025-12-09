# Services

This directory contains all API service modules for communicating with the backend.

## Structure

- **api.ts** - Base axios instance with interceptors for authentication and error handling
- **authService.ts** - Authentication and authorization services
- **projectService.ts** - Project management services (public and admin)
- **clientService.ts** - Client testimonial services (public and admin)
- **contactService.ts** - Contact form submission services
- **newsletterService.ts** - Newsletter subscription services
- **index.ts** - Central export point for all services

## Usage

```typescript
import { projectService, authService } from '~/services';

// Fetch all projects (public)
const projects = await projectService.getAllProjects();

// Login (admin)
const response = await authService.login({ username, password });
```

## Authentication

The API service automatically:
- Adds JWT token to all requests via Authorization header
- Redirects to login page on 401 (Unauthorized) responses
- Stores/retrieves token from localStorage

## Environment Variables

Configure the API base URL in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```
