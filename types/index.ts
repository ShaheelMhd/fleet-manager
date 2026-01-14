export interface Bus {
  id: string;
  number: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'idle';
  route_id: string | null;
  created_at: string;
  route?: Route;
}

export interface Route {
  id: string;
  name: string;
  stops: string[];
  // bus_id dropped in favor of one-route-to-many-buses
  created_at: string;
  buses?: Bus[];
}

export interface Student {
  id: string;
  name: string;
  student_id: string;
  route_id: string | null;
  bus_id?: string | null;
  seat_number: number | null;
  created_at: string;
  route?: Route; // For joined queries
}
