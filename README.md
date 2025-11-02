# Site Renderer

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

A dynamic Next.js application designed to fetch and render websites from a headless API. It uses a block-based rendering system powered by `@cheryx2020/core` to construct pages on the fly based on a given domain.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

## Overview

This project serves as a universal frontend renderer for websites managed by an external, headless system. Instead of hardcoding pages, it dynamically fetches site and page data from an API at build time and runtime.

The core logic is built around a single dynamic route that captures all URL paths. It then queries a backend API for the configuration of a specific site (identified by a domain) and renders the corresponding page using a flexible block-based component system.

## Features

- **Dynamic Routing**: A single `app/[[...slug]]/page.tsx` route handles all pages, including the homepage.
- **Headless Architecture**: Decouples the frontend from the backend, fetching all content from an API.
- **Block-Based Content**: Renders complex page layouts from a JSON configuration using the `@cheryx2020/core` library.
- **Server-Side Rendering & ISR**: Utilizes Next.js App Router with Server Components and Incremental Static Regeneration (`revalidate = 60`) for optimal performance and fresh content.
- **Dynamic Metadata**: SEO tags (title, description, keywords) are generated dynamically for each page based on fetched data.
- **Centralized Data Fetching**: All API communication is handled cleanly within `lib/api.ts`.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20.x or later recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
- Access to the backend API credentials.

## Getting Started

Follow these steps to set up and run the project locally.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd site-renderer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Environment Variables

This project requires environment variables to connect to the API. Create a `.env.local` file in the root of the project and add the following variables.

```sh
# .env.local

# The base URL of the backend API that serves the site data
API_URL=https://api.example.com/sites

# The authentication token for accessing the API
API_TOKEN=your_secret_api_token_here

# The domain of the specific site you want to render locally
SITE_DOMAIN=local.example.com
```

**Note:** The application is designed to render one site per instance, configured by the `SITE_DOMAIN` variable.

## Available Scripts

You can run the following commands from the project root:

- **`npm run dev`**: Starts the application in development mode on `http://localhost:3000`. The page will auto-update as you edit files.

- **`npm run build`**: Creates an optimized production build of the application.

- **`npm run start`**: Starts the production server. This command should be run after building the project with `npm run build`.

## Project Structure

Here is an overview of the key files and directories in the project:

```
site-renderer/
├── app/
│   ├── [[...slug]]/
│   │   └── page.tsx      # Core file: Handles dynamic routing, data fetching, and page rendering.
│   ├── layout.tsx        # Root layout for the application.
│   ├── error.tsx         # Custom error page.
│   └── loading.tsx       # Custom loading UI.
├── components/
│   └── PageRenderer.tsx  # Renders the page using @cheryx2020/core based on API config.
├── lib/
│   └── api.ts            # Contains all logic for fetching site data from the external API.
├── public/               # Static assets.
├── .env.local            # (You create this) Environment variables.
├── next.config.ts        # Next.js configuration.
└── package.json          # Project dependencies and scripts.
```

## Deployment

The easiest way to deploy this Next.js application is to use the [Vercel Platform](https://vercel.com/new), from the creators of Next.js.

When deploying, make sure to set the `API_URL`, `API_TOKEN`, and `SITE_DOMAIN` environment variables in your Vercel project settings.

For more details on deployment, check out the official [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).