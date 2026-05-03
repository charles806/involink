-- Disable RLS on users table since we manage our own auth
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Grant access to anon and authenticated roles
GRANT ALL ON users TO anon, authenticated;