-- Create Buses table
create table if not exists buses (
  id uuid default gen_random_uuid() primary key,
  number text not null unique,
  capacity int not null,
  status text check (status in ('active', 'maintenance', 'idle')) default 'active',
  route_id uuid references routes(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Routes table
create table if not exists routes (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  stops text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Students table
create table if not exists students (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  student_id text not null unique,
  route_id uuid references routes(id) on delete set null,
  bus_id uuid references buses(id) on delete set null,
  seat_number int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_seat_per_route unique (route_id, seat_number) -- Note: constraint might need update to be per-bus?
  -- ideally unique (bus_id, seat_number) if assignment is strictly per bus.
  -- But if we keep route_id, we might want unique (bus_id, seat_number) where bus_id is not null.
);

