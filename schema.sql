-- Create Drivers table
create table if not exists drivers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Routes table
create table if not exists routes (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  stops text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Buses table
create table if not exists buses (
  id uuid default gen_random_uuid() primary key,
  number text not null unique,
  capacity int not null,
  status text check (status in ('active', 'maintenance', 'idle', 'scheduled')) default 'active',
  maintenance_notes text,
  next_maintenance_date timestamp with time zone,
  last_odometer_reading numeric,
  route_id uuid references routes(id) on delete set null,
  driver_id uuid references drivers(id) on delete set null,
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
  constraint unique_bus_seat unique (bus_id, seat_number)
);
