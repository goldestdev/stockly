-- Add theme column to profiles table
alter table profiles 
add column if not exists theme text default 'system';
