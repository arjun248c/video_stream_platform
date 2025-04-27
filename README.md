# VideoStream Platform

A web application where the owner can upload videos and users can stream them online. Built with Next.js, Supabase, and React.

## Features

- User authentication (sign up, sign in, sign out)
- Video upload for authenticated users
- Video browsing and streaming for all users
- Responsive design for all devices
- Protected routes for upload functionality

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Video Player**: React Player
- **File Upload**: React Dropzone

## Prerequisites

Before you begin, ensure you have:

1. Node.js (v18 or newer)
2. A Supabase account (free tier works fine)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd video-stream-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Project Settings > API and copy the URL and anon key
3. Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up the database schema by running the SQL commands in `supabase-schema.sql` in the Supabase SQL Editor

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

### Deploy on Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Add the environment variables from your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
5. Click "Deploy"

#### Detailed Vercel Deployment Steps:

1. **Create a GitHub Repository**:
   - Create a new repository on GitHub
   - Push your local code to the repository:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/yourusername/your-repo-name.git
     git push -u origin main
     ```

2. **Sign Up/Login to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Sign up or log in with your GitHub account

3. **Create a New Project**:
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Vercel will automatically detect that it's a Next.js project

4. **Configure Project**:
   - In the "Configure Project" screen, expand "Environment Variables"
   - Add the following environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - Keep the default settings for everything else

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once deployed, you'll get a URL where your application is live

6. **Custom Domain (Optional)**:
   - In your project dashboard, go to "Settings" > "Domains"
   - Add your custom domain and follow the instructions to set it up

### Alternative Deployment Options

- **Netlify**: Similar process to Vercel, with automatic deployments from Git
- **AWS Amplify**: Provides additional backend capabilities and easy integration with AWS services
- **Digital Ocean App Platform**: Simple deployment with scaling options

## Database Schema

The application uses the following database schema:

### Videos Table

- `id`: UUID (Primary Key)
- `title`: Text (Required)
- `description`: Text
- `url`: Text (Required)
- `file_path`: Text (Required)
- `user_id`: UUID (Foreign Key to auth.users)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## License

MIT
