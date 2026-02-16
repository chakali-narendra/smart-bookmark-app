# Smart Bookmark App

A simple, private, and real-time bookmark manager built with **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**.

## Features
- **Google OAuth Only**: Secure login using Google.
- **Private Bookmarks**: Each user can only see and manage their own bookmarks.
- **Real-time Updates**: Changes (add/delete) reflect instantly across all open tabs without refreshing.
- **Responsive & Premium UI**: Built with Tailwind CSS v4 and Framer Motion for a modern look and feel.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase (Auth, PostgreSQL, Realtime)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Setup Instructions

### 1. Supabase Configuration
Create a new Supabase project and run the following SQL in the SQL Editor to set up the database and Enable Realtime:

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using ( auth.uid() = user_id );

-- Enable Realtime for the bookmarks table
alter publication supabase_realtime add table bookmarks;
```

### 2. Environment Variables
Rename `.env.local.example` to `.env.local` and fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and set up OAuth Consent Screen.
3. Create OAuth 2.0 Client ID (Web Application).
4. Add Supabase Auth Redirect URI to "Authorized redirect URIs" in Google Console:
   `https://<project-id>.supabase.co/auth/v1/callback`
5. Add the Client ID and Secret to Supabase Dashboard under **Authentication > Providers > Google**.

### 4. Installation & Running
```bash
npm install
npm run dev
```

## Problems & Solutions

### 1. Real-time Subscription Filtering
**Problem**: Initially, subscribing to all changes in the `bookmarks` table meant users might receive events for other users' bookmarks (even if RLS blocked the data, the event trigger could be noisy or leak IDs).
**Solution**: Implemented PostgreSQL channel filtering in the client-side `useEffect` using `filter: user_id=eq.${userId}`. This ensures the client only listens to events relevant to the logged-in user.

### 2. Middleware Session Refresh
**Problem**: Server Components sometimes lacked the latest session information because Next.js caches headers.
**Solution**: Implemented a robust middleware utility that refreshes the Supabase session on every request, ensuring that `supabase.auth.getUser()` always returns the correct user state in both Server and Client components.

### 3. Tailwind CSS v4 Migration
**Problem**: The project uses Tailwind CSS v4, which handles configuration differently (removing `tailwind.config.js` in favor of CSS variables).
**Solution**: Utilized the new `@theme` block in `globals.css` to define the design tokens and integrated `@tailwindcss/postcss` for seamless compilation.

### 4. Real-time Sync across Tabs
**Problem**: Using only Server Actions for data mutation would update the current tab (via `revalidatePath`) but not other open tabs.
**Solution**: Combined Server Actions for reliable data mutation with Supabase Realtime subscriptions in the `BookmarkList` component. When a mutation occurs, Supabase broadcasts the change, and the client-side state is updated dynamically.
