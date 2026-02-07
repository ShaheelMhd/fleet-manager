# Fleet Manager

A comprehensive fleet and student transportation management system built with Next.js, Supabase, and NextAuth.

## Features

### 🔐 Authentication & Security
- **Supabase Auth Integration**: Secure identity management using Supabase.
- **NextAuth.js**: Implements session management and secure routing.
- **Robust Validation**: All authentication forms (Login, Register, Forgot Password) are validated client-side and server-side using **Zod** and **React Hook Form**.
- **Email Verification**: Mandatory email confirmation before account activation.
- **Password Recovery**: Complete "Forgot Password" and "Reset Password" flow integrated with Supabase Auth.
- **Secure Logout**: Easily accessible logout functionality from the dashboard sidebar.

### 📊 Dashboard
- **Comprehensive Fleet Management**: Track bus status (Active, Maintenance, Idle) and capacity.
- **Route Planning**: Create and manage transportation routes and stops.
- **Student Assignment**: Assign students to specific routes and buses with seat allocation.
- **Real-time Stats**: High-level overview of fleet status and route activity.

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fleet-manager-tkmit/fleet-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `fleet-manager` directory and add your Supabase and NextAuth credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- `app/dashboard`: Main management interface.
- `app/(auth)`: Authentication routes (login, register, forgot-password).
- `app/api`: Backend API routes for buses, routes, students, and users.
- `components/ui`: Reusable UI components built with Tailwind and Shadcn.
- `utils/supabaseClient.ts`: Supabase client configuration.

## Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new). Make sure to configure your Supabase environment variables in the Vercel dashboard.
