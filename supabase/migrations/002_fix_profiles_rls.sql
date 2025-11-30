-- Add INSERT policy for profiles table
-- This allows users to create their own profile during signup
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger function to auto-create profile on user signup
-- This follows Supabase best practices and ensures profile is always created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', new.email)
  );
  RETURN new;
END;
$$;

-- Create trigger on auth.users table
-- This automatically creates a profile whenever a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
