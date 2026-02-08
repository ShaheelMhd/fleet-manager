export interface Bus {
  id: string;
  number: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'idle' | 'scheduled';
  route_id: string | null;
  driver_id: string | null;
  maintenance_notes?: string;
  next_maintenance_date?: string | null;
  last_odometer_reading?: number | null;
  created_at: string;
  route?: Route;
  driver?: Driver;
}

export interface Driver {
  id: string;
  name: string;
  phone_number: string | null;
  created_at: string;
}

export interface Route {
  id: string;
  name: string;
  stops: string[];
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
  route?: Route;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number | null;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
