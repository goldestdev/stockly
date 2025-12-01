-- Create sales table
create table if not exists sales (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  item_id uuid references items(id) on delete set null,
  quantity integer not null check (quantity > 0),
  total_price numeric not null check (total_price >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table sales enable row level security;

-- Create policies
create policy "Users can view their own sales"
  on sales for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sales"
  on sales for insert
  with check (auth.uid() = user_id);
