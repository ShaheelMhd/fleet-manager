export interface Bus {
  id: string;
  number: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'idle';
  route_id: string | null;
  maintenance_notes?: string;
  created_at: string;
  route?: Route;
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
