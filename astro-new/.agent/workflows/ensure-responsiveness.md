---
description: Ensure Website Responsiveness using Tailwind CSS
---

# Responsive Design Implementation Plan

This workflow outlines the steps to ensure the website is fully responsive across all devices (Mobile, Tablet, Desktop) using the existing Tailwind CSS library.

## 1. Global Layout Configuration
- [x] **Viewport Meta Tag**: Ensure `<meta name="viewport" content="width=device-width, initial-scale=1" />` exists in `src/layouts/Layout.astro`.
- [x] **Global CSS**: Remove fixed widths from `body` or `main` in `src/styles/global.css`. Use `max-w-screen` and `overflow-x-hidden` on the body to prevent horizontal scroll.

## 2. Component Audit & Refactor
- [ ] **Header**: Ensure the navigation collapses into a hamburger menu on screens smaller than `md` (768px).
- [ ] **Hero Sections**: Use `clamp()` for font sizes to prevent huge text on mobile.
- [ ] **Grids**: Convert fixed column grids to responsive grids (e.g., `grid-cols-1 md:grid-cols-3`).
- [ ] **Tables**: Wrap all tables in a `div` with `overflow-x-auto` to allow horizontal scrolling on mobile.

## 3. Library Addition (Optional but Recommended)
- [x] **shadcn/ui**: We are using `shadcn/ui` (built on Tailwind) for accessible, responsive components like Sheets (Mobile Menu), Dialogs, and Accordions.
- [ ] **Tailwind Typography**: Ensure `@tailwindcss/typography` is used for blog content to handle responsive text scaling automatically.

## 4. Execution Steps
1.  **Fix Global Container**:
    ```css
    /* src/styles/global.css */
    body {
        overflow-x: hidden; /* Prevent horizontal scroll */
        width: 100%;
    }
    .container-responsive {
        width: 100%;
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1rem; /* 16px padding on mobile */
    }
    @media (min-width: 768px) {
        .container-responsive {
            padding: 0 2rem;
        }
    }
    ```
2.  **Refactor Pages**: Update `src/pages/index.astro` and others to use `.container-responsive` or Tailwind equivalents (`w-full max-w-7xl mx-auto px-4 sm:px-6`).

// turbo
3.  **Run Validation**: Check the site on mobile view (Chrome DevTools).
