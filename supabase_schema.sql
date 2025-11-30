-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  plan text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create items table
create table items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  quantity integer default 0,
  cost_price numeric,
  selling_price numeric,
  low_stock_threshold integer default 3,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table items enable row level security;

-- Policies for profiles
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Policies for items
create policy "Users can view own items" on items
  for select using (auth.uid() = user_id);

create policy "Users can insert own items" on items
  for insert with check (auth.uid() = user_id);

create policy "Users can update own items" on items
  for update using (auth.uid() = user_id);

create policy "Users can delete own items" on items
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
