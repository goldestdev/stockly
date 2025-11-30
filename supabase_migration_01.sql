-- Add new columns to profiles table
alter table profiles 
add column if not exists full_name text,
add column if not exists business_type text;

-- Update the handle_new_user function to capture metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, business_type)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'business_type'
  );
  return new;
end;
$$ language plpgsql security definer;
