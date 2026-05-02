# StoreIt

StoreIt is a modern, privacy-focused smart storage management web app built with Next.js and Appwrite. It combines secure uploads, per-user access controls, and a clean dashboard so you can manage personal and shared files across devices with confidence.

## Features
- Secure user authentication with Appwrite (email OTP)
- Personal and shared file storage with per-file access controls
- Client and server upload flows for flexible security models
- File preview and thumbnail generation for images and media
- Email-based file sharing
- Usage dashboard with storage consumption and recent activity
- Rate-limited uploads and audit logging

## Tech Stack
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
- Backend / Auth: Appwrite (Databases, Storage, Account)
- Storage: Appwrite Storage (buckets + access controls)
- Dev tooling: npm, Turbopack (Next.js dev)

## Repository Structure (high level)
- `app/` - Next.js app routes, pages, and layouts
- `components/` - Reusable UI components and client code
- `components/dashboard/` - Dashboard-specific components
- `lib/` - Appwrite client wrappers, actions, utilities
- `public/` - Static assets (icons, images)
- `types/` - TypeScript declarations

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io
NEXT_PUBLIC_APPWRITE_PROJECT=<your_project_id>
NEXT_PUBLIC_APPWRITE_DATABASE=<database_id>
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=<users_collection_id>
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=<files_collection_id>
NEXT_PUBLIC_APPWRITE_BUCKET=<storage_bucket_id>
NEXT_APPWRITE_KEY=<admin_api_key>
```

Notes:
- `NEXT_APPWRITE_KEY` is server-side only and must not be exposed to clients.
- The `NEXT_PUBLIC_*` values are used on both server and client.

### 3) Start the dev server
```bash
npm run dev
```

Open http://localhost:3000 (or the port printed by Next.js).

## Available Scripts
- `npm run dev` - Start the dev server (Turbopack)
- `npm run dev:clean` - Clear `.next` and start the dev server
- `npm run lint` - Run Next.js linting
- `npm run build` - Build for production
- `npm run start` - Start the production server

## Deployment
- Provide the same environment variables to your hosting platform (Vercel, Netlify, etc.).
- Store `NEXT_APPWRITE_KEY` as a server-side secret.

## Security & Uploads
- Client uploads use permissive `Role.any()` for Appwrite Cloud compatibility; for per-user ACLs and stronger guarantees, use the server-side upload endpoints in `lib/actions/file.actions.ts` which require an admin key.
- Rate limiting and audit logging are implemented in `lib/ratelimit.ts` and `lib/audit.ts`.

## Troubleshooting
- If you see `Invalid URL`, confirm the Appwrite endpoint is correct.
- If you see `No session found`, verify the Appwrite session cookie (`appwrite-session`) is present.

## Contributing
- Fork the repo, create a branch, and open a PR. Provide tests for new features where appropriate.

## License
MIT License

---

For API details and architecture notes, see the `lib/` folder and inline docs in the source files.
