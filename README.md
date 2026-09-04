# Parent Update Message Generator

A responsive web application that helps mentors turn weekly program notes into a structured parent update, a printable PDF, a Word-compatible document, and a WhatsApp-ready message.

## Features

- Collects lessons, videos, books, activities, book assignments, Qur'an assignments, and parent expectations in one form.
- Generates a live, structured preview while the mentor types.
- Creates a polished parent message that can be copied or opened in WhatsApp.
- Produces print-ready PDF output through the browser print dialog.
- Exports a Word-compatible `.doc` file with the program table and message.
- Supports up to four program photos and places them on a separate document page.
- Processes form data and photos locally in the browser; no database or server upload is used.

## Tech Stack

- TypeScript
- React 19
- Next.js App Router through Vinext
- Vite
- Tailwind CSS
- Cloudflare Pages / Workers tooling

## Core Implementation

This project uses the Next.js App Router, so the application source lives in `app/` rather than a traditional `src/` directory.

The main application logic is in [`app/page.tsx`](app/page.tsx). It contains:

- controlled React form state;
- automatic message composition;
- client-side image validation and `FileReader` processing;
- PDF generation through `window.print()` and print-specific CSS;
- Word-compatible document creation with `Blob` and object URLs; and
- WhatsApp sharing with an encoded `wa.me` URL.

The visual system and responsive/print layouts are defined in [`app/globals.css`](app/globals.css).

## Run Locally

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

## Production Build

```bash
npm run build
```

The static site is generated in `dist/client`.

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist/client`
- Node.js version: `22.13` or newer

## Privacy

All entered information and uploaded photos remain in the user's browser session. The application does not store or transmit personal data.
