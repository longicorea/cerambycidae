# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application for displaying Cerambycidae (longhorn beetle) collection data. The app is configured for static export and deployment to GitHub Pages. It features a searchable interface showing specimen data with associated Flickr images.

## Key Architecture

- **Static Site Generation**: The app uses Next.js with `output: "export"` for static hosting on GitHub Pages
- **Data Layer**: Large datasets are stored in TypeScript files:
  - `src/data/collData.ts` - Collection specimen data (~476KB)
  - `src/data/imageData.ts` - Flickr image URLs and metadata (~415KB)
- **Component Structure**: Simple layout with modular components in `src/components/`
- **Search & Display**: Main page filters collection data and displays matching specimens with images

## Common Development Commands

```bash
# Install dependencies (uses yarn as primary package manager)
yarn install

# Development server
yarn dev

# Build for production (creates static export in /out)
yarn build

# Linting
yarn lint

# Start production server (note: not used for GitHub Pages deployment)
yarn start
```

## GitHub Pages Configuration

- **Base Path**: Configured as `/cerambycidae` in `next.config.mjs`
- **Static Export**: Images are unoptimized due to static hosting limitations
- **Deployment**: Automated via GitHub Actions on pushes to main branch
- **Output Directory**: Static files are generated in `/out` directory

## Data Management

The application handles large datasets efficiently:
- Collection data includes specimen IDs, locations, dates, and taxonomic information
- Image data links specimens to Flickr photos with multiple size variants
- Search functionality filters by ID, Korean name, location, and host plant
- Random sampling displays 10 items when no search term is provided

## TypeScript Configuration

- Uses Next.js 14+ with App Router
- Tailwind CSS for styling
- Lodash for utility functions
- react-loops for efficient list rendering
- Configured for static export compatibility

## Deployment Notes

- Deploys automatically to GitHub Pages via GitHub Actions
- Uses both `nextjs.yml` and `deploy.yml` workflows
- Supports both npm and yarn package managers
- Node.js version set to "lts/*" in workflows