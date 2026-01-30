# Portfolio with Admin Panel & Vercel Database

This is a Next.js application with a public portfolio homepage and a secure admin dashboard powered by Vercel Postgres.

## Setup Instructions

### 1. Deploy to Vercel

1.  Push this code to your GitHub repository.
2.  Go to [Vercel](https://vercel.com) and import the project.
3.  Deploy the project.

### 2. Connect Database (Vercel Postgres)

1.  In your Vercel Project Dashboard, go to the **Storage** tab.
2.  Click **Connect Store** -> **Postgres** -> **Create New**.
3.  Accept the terms and create the database.
4.  Once created, Vercel will automatically add the necessary Environment Variables (`POSTGRES_URL`, etc.) to your deployment.
5.  **Redeploy** your application (Go to Deployments -> Redeploy) to ensure the new environment variables are picked up.

### 3. Initialize the Database

The application is designed to automatically create the table if it doesn't exist when you first access the API, but you can also manually run this SQL in the Vercel Storage "Query" tab:

```sql
CREATE TABLE IF NOT EXISTS portfolio (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Admin Access

- Go to `https://your-domain.vercel.app/admin`
- Default Login:
  - Username: `admin`
  - Password: `password`
- **Important**: Change the hardcoded credentials in `app/admin/page.tsx` before sharing widely!

## Features

- **Public Homepage**: Displays all portfolio items dynamically.
- **Admin Dashboard**: Login protected area.
- **CRUD Operations**: Add, View, and Delete projects.
- **Image Support**: Upload images (stored as Base64 strings).
- **Database**: Persists data using Vercel Postgres.
