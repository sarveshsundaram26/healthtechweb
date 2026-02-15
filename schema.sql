-- Existing profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,
  role text check (role in ('patient', 'doctor', 'admin', 'caretaker')) default 'patient',

  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- NEW: Vitals Table
create table vitals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  heart_rate integer,
  systolic_bp integer,
  diastolic_bp integer,
  weight numeric,
  created_at timestamp with time zone default now()
);

alter table vitals enable row level security;

create policy "Users can view their own vitals." on vitals
  for select using (auth.uid() = user_id);

create policy "Users can insert their own vitals." on vitals
  for insert with check (auth.uid() = user_id);

-- NEW: Emergency Contacts Table
create table emergency_contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  name text not null,
  phone text not null,
  relation text,
  is_primary boolean default false,
  created_at timestamp with time zone default now()
);

alter table emergency_contacts enable row level security;

create policy "Users can view their own emergency contacts." on emergency_contacts
  for select using (auth.uid() = user_id);

create policy "Users can insert their own emergency contacts." on emergency_contacts
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own emergency contacts." on emergency_contacts
  for delete using (auth.uid() = user_id);

-- Enforce only one primary contact per user
create unique index if not exists unique_primary_contact 
on emergency_contacts (user_id) 
where (is_primary = true);

-- NEW: Reminders Table
create table reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  medicine_name text not null,
  dosage text,
  frequency text,
  time text,
  last_notified_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table reminders enable row level security;

create policy "Users can view their own reminders." on reminders
  for select using (auth.uid() = user_id);

create policy "Users can insert their own reminders." on reminders
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own reminders." on reminders
  for delete using (auth.uid() = user_id);

create policy "Users can update their own reminders." on reminders
  for update using (auth.uid() = user_id);
