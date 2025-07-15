# Supabase Authentication Setup Guide

## Prerequisites

1. **Install Supabase dependencies** (run this command manually due to PowerShell restrictions):
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to get these values:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key
4. Paste them in your `.env.local` file

## Authentication Features

### ✅ What's Included:

1. **Email/Password Authentication**
   - Sign up with email confirmation
   - Sign in with email and password
   - Password reset functionality

2. **OAuth Providers**
   - Google OAuth
   - GitHub OAuth
   - Easy to add more providers

3. **Protected Routes**
   - Middleware automatically redirects unauthenticated users
   - Login and signup pages are accessible without authentication

4. **User Management**
   - User context provider for global state
   - Automatic session management
   - Logout functionality

5. **UI Components**
   - Beautiful authentication forms
   - Loading states and error handling
   - Responsive design with Tailwind CSS

## File Structure

```
├── lib/supabase.ts              # Supabase client configuration
├── middleware.ts                # Authentication middleware
├── app/auth/callback/route.ts   # OAuth callback handler
├── app/login/page.tsx           # Login page
├── app/signup/page.tsx          # Signup page
├── components/auth/
│   ├── AuthForm.tsx            # Reusable auth form
│   ├── UserProvider.tsx        # User context provider
│   └── LogoutButton.tsx        # Logout component
```

## Usage

### 1. Authentication Flow
- Users visit `/login` or `/signup`
- After successful authentication, they're redirected to the dashboard
- Unauthenticated users are automatically redirected to `/login`

### 2. Using User Context
```tsx
import { useUser } from '@/components/auth/UserProvider'

function MyComponent() {
  const { user, loading } = useUser()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>
  
  return <div>Welcome, {user.email}!</div>
}
```

### 3. Server-Side Authentication
```tsx
import { createServerComponentClient } from '@/lib/supabase'

export default async function ServerComponent() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return <div>Server-side user: {user?.email}</div>
}
```

## OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
6. Add the client ID and secret to Supabase Auth settings

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Add the client ID and secret to Supabase Auth settings

## Security Notes

- Never expose your service role key in client-side code
- Use environment variables for all sensitive configuration
- The middleware automatically handles session refresh
- All authentication state is managed securely with cookies

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Check that your environment variables are correct
   - Ensure you're using the anon key, not the service role key

2. **OAuth redirect errors**
   - Verify redirect URLs are correctly configured in Supabase
   - Check that your domain is added to allowed redirect URLs

3. **Session not persisting**
   - Ensure middleware is properly configured
   - Check that cookies are being set correctly

4. **Build errors**
   - Make sure all dependencies are installed
   - Check TypeScript types are correct

## Next Steps

1. Customize the UI components to match your brand
2. Add additional OAuth providers as needed
3. Implement user profile management
4. Add role-based access control
5. Set up database policies for your tables 