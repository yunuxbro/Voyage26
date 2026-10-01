# MongoDB Setup

Voyage stores Better Auth accounts/sessions, registrations, payment settings, orders, products, gallery entries, and event sessions in MongoDB. Payment slips are stored in a private GridFS bucket. Do not add connection strings or admin codes to source files, chat, screenshots, or commits.

## Rotate the exposed credential

A MongoDB connection string was posted in chat. In MongoDB Atlas, rotate the database user's password before using it. Update the connection string in your local environment and deployment settings; do not reuse the exposed password.

## Local development

1. In Atlas, create a database user scoped to the Voyage database and allow the development machine to connect using Network Access.
2. Open PowerShell in the project directory. Set the rotated values for the current terminal session, replacing the placeholders locally:

   ```powershell
   $env:MONGODB_URI = "mongodb+srv://<user>:<rotated-password>@<cluster-host>/"
   $env:MONGODB_DATABASE = "voyage26"
   $env:VOYAGE_ADMIN_CODE = "<long-random-admin-code>"
   npm run dev
   ```

3. Visit `/register`. It remains closed until bank details and prices are saved from `/admin`.

`MONGODB_DATABASE` defaults to `voyage26` if omitted. Do not put these values in `.env` files or project JSON. Restart the dev server after changing them.

## Deployment

In Vercel Project Settings, add `MONGODB_URI`, `MONGODB_DATABASE`, and `VOYAGE_ADMIN_CODE` as server-side environment variables for the required environments. Do not prefix these variables with `VITE_`. Configure Atlas network access for the deployment using the narrowest access policy supported by the selected Vercel plan.

## First run

The app creates its MongoDB collections and indexes and seeds the existing Voyage site, product, gallery, and event-session content when the first server request connects. It does not delete SQL migration files or automatically copy data from an existing PostgreSQL database. Admin sign-in remains the existing Google/X or configured email-password flow; Better Auth stores its accounts and sessions in MongoDB.

After signing in, enter the admin code, open **Payments**, then save the transfer instructions, package prices, and optional registration/payment image. Set **Register only** to `0` to let delegates register without a merchandise package and without uploading a payment slip. Paid packages require a slip and are reviewed in **Berths**.
