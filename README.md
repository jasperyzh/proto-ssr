# Event Ticketing App with Astro and Supabase

A server-side rendered (SSR) application for generating and sharing event tickets, built with Astro and Supabase.

## Features

- User authentication (register, login, verify)
- Dynamic ticket generation
- QR codes for ticket verification 
- Social sharing with custom OG images
- Server-side rendering for SEO and performance

## Tech Stack

- **Astro**: Frontend framework for static-first server-rendered apps
- **Supabase**: Backend-as-a-Service (BaaS) with PostgreSQL and auth
- **React**: Component library for interactive UI elements
- **iron-session**: Encrypted stateless session data for security

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd proto-ssr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project from the [Supabase Dashboard](https://app.supabase.com)
   - Note down your Supabase URL and anon key
   - Create the following tables in your Supabase database:

     **profiles**
     ```sql
     CREATE TABLE profiles (
       id UUID PRIMARY KEY REFERENCES auth.users(id),
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL,
       verified BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```

     **verification_tokens**
     ```sql
     CREATE TABLE verification_tokens (
       token TEXT PRIMARY KEY,
       user_id UUID REFERENCES profiles(id) NOT NULL,
       expires_at TIMESTAMP WITH TIME ZONE NOT NULL
     );
     ```

     **tickets**
     ```sql
     CREATE TABLE tickets (
       id TEXT PRIMARY KEY,
       user_id UUID REFERENCES profiles(id) NOT NULL,
       venue_name TEXT NOT NULL,
       venue_location TEXT NOT NULL,
       date TEXT NOT NULL,
       time TEXT NOT NULL,
       username TEXT NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```

4. Create a `.env` file at the root of your project with the following variables:
   ```
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_KEY=your-supabase-anon-key
   SESSION_SECRET=your-session-secret-at-least-32-characters
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/components`: Reusable UI components
- `/src/layouts`: Page layout templates
- `/src/lib`: Core functionality
  - `supabaseClient.js`: Supabase client initialization
  - `supabaseDB.js`: Database operations
  - `supabaseAuth.js`: Authentication logic
  - `qrcode.js`: QR code generation
- `/src/pages`: Route pages and API endpoints
- `/public`: Static assets

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to a Git repository
2. Import the project into Vercel
3. Add your environment variables
4. Deploy!

## License

MIT