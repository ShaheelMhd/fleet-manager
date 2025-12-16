export interface Bus {
  id: string;
  number: string;
  capacity: number;
  status: 'active' | 'maintenance';
  created_at: string;
}

export interface Route {
  id: string;
  name: string;
  stops: string[];
  bus_id: string | null;
  created_at: string;
  bus?: Bus; // For joined queries
}

export interface Student {
  id: string;
  name: string;
  student_id: string;
  route_id: string | null;
  seat_number: number | null;
  created_at: string;
  route?: Route; // For joined queries
}
